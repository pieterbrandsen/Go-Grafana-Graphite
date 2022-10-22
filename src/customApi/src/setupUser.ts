import axios, { AxiosBasicCredentials } from 'axios'
import winston, { configure } from 'winston'
import fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const _filename = fileURLToPath(import.meta.url)
const _dirname = dirname(_filename)

if (process.env.GRAFANA_URL === undefined) {
  process.env.GRAFANA_URL = 'http://localhost:3000'
}
if (process.env.GRAFANA_USER === undefined) {
  process.env.GRAFANA_USER = 'admin'
}
if (process.env.GRAFANA_PASSWORD === undefined) {
  process.env.GRAFANA_PASSWORD = 'admin'
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/setupUser.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

const grafanaApiUrl = process.env.GRAFANA_URL + '/api'
const adminLogin: AxiosBasicCredentials = {
  username: process.env.GRAFANA_USER,
  password: process.env.GRAFANA_PASSWORD
}

async function GetOrg (name: string): Promise<any> {
  try {
    const result = await axios({
      url: `${grafanaApiUrl}/orgs/name/${name}`,
      method: 'get',
      auth: adminLogin
    })
    return result.data
  } catch (err: any) {
    logger.error(`GetOrg error! ${JSON.stringify(err)}`)
    return err.response
  }
}

async function CreateUser (config: Config): Promise<any> {
  try {
    const result = await axios({
      url: `${grafanaApiUrl}/admin/users`,
      method: 'post',
      auth: adminLogin,
      data: {
        name: config.username,
        email: config.email,
        login: config.username,
        password: config.password,
        orgId: undefined
      }
    })
    return result.data
  } catch (err: any) {
    return err.response
  }
}

async function SwitchToOrg (orgId: number, userLogin: AxiosBasicCredentials): Promise<any> {
  try {
    const result = await axios({
      url: `${grafanaApiUrl}/user/using/${orgId}`,
      method: 'post',
      auth: userLogin
    })
    return result.data
  } catch (err: any) {
    logger.error(`SwitchToOrg error! ${JSON.stringify(err)}`)
    return err.response
  }
}

async function AddUserToOrg(orgId:number, config:Config, userLogin:AxiosBasicCredentials):Promise<any> {
  try {
    const result = await axios({
      url: `${grafanaApiUrl}/orgs/${orgId}/users`,
      method: 'post',
      auth: userLogin,
      data: {
        loginOrEmail: config.targetUsername,
        role: config.role
      }
    })
    return result.data
  } catch (err: any) {
    logger.error(`AddUserToOrg error! ${JSON.stringify(err)}`)
    return err.response
  }
}

async function CreateDatasource (userLogin: AxiosBasicCredentials): Promise<any> {
  try {
    const result = await axios({
      url: `${grafanaApiUrl}/datasources`,
      method: 'post',
      auth: userLogin,
      data: {
        name: 'Graphite',
        type: 'graphite',
        url: 'http://gateway:8181',
        access: 'proxy',
        isDefault: true,
        jsonData: {
          graphiteVersion: '1.1',
          graphiteType: 'default',
          keepCookies: ['grafana_session']
        }
      }
    })
    return result.data
  } catch (err: any) {
    logger.error(`CreateDatasource error! ${JSON.stringify(err)}`)
    return err.response
  }
}

async function CreateDashboard (userLogin: AxiosBasicCredentials): Promise<any> {
  try {
    const dashboard = fs.readFileSync(`${_dirname}/dashboard.json`, 'utf8')
    const result = await axios({
      url: `${grafanaApiUrl}/dashboards/db`,
      method: 'post',
      auth: userLogin,
      data: { dashboard: dashboard }
    })
    return result.data
  } catch (err: any) {
    logger.error(`CreateDashboard error! ${JSON.stringify(err)}`)
    return err.response
  }
}

export async function SetupUserCommand (config: Config): Promise<ApiResponse> {
  if (config.username === undefined) {
    return { code: 400, message: 'username is required' }
  }
  if (config.email === undefined) {
    return { code: 400, message: 'email is required' }
  }
  config.username = config.username.toLowerCase()
  config.email = config.email.toLowerCase()

  const userLogin: AxiosBasicCredentials = {
    username: config.username,
    password: config.password
  }

  const user = await CreateUser(config)
  if (user.status !== undefined) return { code: user.status, message: user.data.message }

  const org = await GetOrg(config.email)
  if (org.status !== undefined) return { code: org.status, message: org.data.message }
  const orgId = org.id

  const switchToOrg = await SwitchToOrg(orgId, userLogin)
  if (switchToOrg.status !== undefined) return { code: switchToOrg.status, message: switchToOrg.data.message }

  const datasource = await CreateDatasource(userLogin)
  if (datasource.status !== undefined) return { code: datasource.status, message: datasource.data.message }

  const dashboard = await CreateDashboard(userLogin)
  if (dashboard.status !== undefined) return { code: dashboard.status, message: dashboard.data.message }

  return { code: 200, message: 'User setup successfully' }
}

export async function AddUserToOrgCommand(config:Config):Promise<ApiResponse> {
  if (config.targetUsername === undefined) {
    return { code: 400, message: 'targetUsername is undefined' }
  }
 
  config.username = config.username.toLowerCase()
  config.targetUsername = config.targetUsername.toLowerCase()
  config.email = `${config.username}@${config.username}.com`
  const userLogin: AxiosBasicCredentials = {
    username: config.username,
    password: config.password
  }

  const org = await GetOrg(config.email)
  if (org.status !== undefined) return { code: org.status, message: org.data.message }
  const orgId = org.id

  const switchToOrg = await SwitchToOrg(orgId, userLogin)
  if (switchToOrg.status !== undefined) return { code: switchToOrg.status, message: switchToOrg.data.message }

  const addUserToOrg = await AddUserToOrg(orgId, config, userLogin)
  if (addUserToOrg.status !== undefined) return { code: addUserToOrg.status, message: addUserToOrg.data.message }

  return { code: 200, message: 'User added to org successfully' }
}