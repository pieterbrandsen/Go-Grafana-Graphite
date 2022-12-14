import util from 'util'
import zlib from 'zlib'
import axios from 'axios'
import graphite from 'graphite'
import { Users } from '../postgres/query'
import winston from 'winston'
import ConvertServerStats from './serverStats'
if (process.env.CARBON_RELAY_NG_URL === undefined) {
  process.env.CARBON_RELAY_NG_URL = 'http://localhost:2003'
}
const client = graphite.createClient(`plaintext://${process.env.CARBON_RELAY_NG_URL.replace('http://', '')}/`)

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

export default class HandleStatsGetter {
  config: Config
  host: string
  constructor (config: Config) {
    this.config = config
    this.host = this.GetHost()
  }

  GetHost (): string {
    if (this.config.is_private_server) {
      return `http://${this.config.host as string}:${this.config.port as number}/api`
    }
    return 'https://api.screeps.com:443/api'
  }

  async req (path: string, method = 'GET', body = {}): Promise<any> {
    const headers: StringMap<string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    }
    if (this.config.username !== undefined) headers['X-Username'] = this.config.username
    if (this.config.token !== undefined) headers['X-Token'] = this.config.token
    const options = {
      method,
      url: `${this.host}${path}`,
      headers,
      data: body
    }
    const maxTime = new Promise((resolve) => {
      setTimeout(resolve, 10 * 1000, { status: 408, statusText: 'Request timed out!' })
    })

    const executeReq = new Promise((resolve) => {
      try {
        axios.request(options).then((res) => {
          resolve(res)
        }).catch((error) => {
          resolve({ error })
        })
      } catch (error) {
        resolve({ error })
      }
    })

    return await Promise.race([executeReq, maxTime])
      .then((result: any) => {
        if (result.error !== undefined) {
          logger.error(`Error: ${path}, ${JSON.stringify(result.error)}`)
          return undefined
        }

        if (result.status !== 200) {
          logger.error(`Failed: ${path}, ${JSON.stringify(result)}`)
          return undefined
        }
        return result
      })
  }

  async gz (data: string): Promise<any> {
    const gunzipAsync = util.promisify(zlib.gunzip)
    const buf = Buffer.from(data.slice(3), 'base64')
    const ret = await gunzipAsync(buf)
    return JSON.parse(ret.toString())
  }

  async GetPrivateServerToken (): Promise<any> {
    const res = await this.req('/auth/signin', 'POST', {
      email: this.config.username,
      password: this.config.private_server_password
    })
    if (res === undefined) return undefined
    return res.data.token
  }

  async GetMemory (): Promise<any> {
    const statsPath = this.config.stats_path
    const shard = this.config.shard

    const res = await this.req(`/user/memory?path=${statsPath}&shard=${shard}`, 'GET')
    if (res === undefined) return undefined
    const data = await this.gz(res.data.data)
    return data
  }

  async GetLeaderboard (): Promise<any> {
    const res = await this.req(`/leaderboard/find?username=${this.config.username}&mode=world`, 'GET')
    if (res === undefined) return undefined
    const leaderboard = res.data.list
    if (leaderboard.length === 0) return { rank: 0, score: 0 }
    const { rank, score } = leaderboard.slice(-1)[0]
    return { rank, score }
  }

  async getUsers (): Promise<any> {
    const res = await this.req('/stats/users', 'GET')
    if (res === undefined) return undefined
    return res
  }

  async getRoomsObjects (): Promise<any> {
    const res = await this.req('/stats/rooms/objects', 'GET')
    if (res === undefined) return undefined
    return res
  }

  ValidateConfig (): boolean {
    if (!this.config.is_private_server) return true
    if (this.config.is_private_server && this.config.username !== undefined && this.config.private_server_password !== undefined && this.config.host !== undefined) return true
    return false
  }

  async Start (): Promise<any> {
    const config = this.config
    if (!this.ValidateConfig()) {
      logger.error(`Invalid config for ${config.username}-${config.shard}-${config.user_id}`)
      return
    };
    if (config.is_private_server) {
      const token = await this.GetPrivateServerToken()
      if (token === undefined) {
        logger.error(`Failed to get token for ${config.username}-${config.shard}-${config.user_id}`)
        return
      };
      config.token = token
    }

    const leaderboard = await this.GetLeaderboard()
    const memory = await this.GetMemory()
    if (leaderboard === undefined || memory === undefined) {
      logger.error(`Failed to get leaderboard or memory for ${config.username}-${config.shard}-${config.user_id}, ${leaderboard}, ${memory}`)
      return
    };
    memory.leaderboard = leaderboard

    let serverStats
    if (config.include_server_stats) {
      const users = await this.getUsers()
      const roomsObjects = await this.getRoomsObjects()
      if (users !== undefined && roomsObjects !== undefined) serverStats = ConvertServerStats(users.data, roomsObjects.data)
    }

    const result = await this.Report(memory, serverStats)
    logger.info(`Reported ${config.username}-${config.shard}-${config.user_id} ${serverStats ? 'with serverStats' : ''}, ${result}`)
  }

  async Report (stats: any, serverStats: any): Promise<any> {
    try {
      const user = await Users.GetUser(this.config.user_id)
      if (user === undefined) return undefined
      const host = (this.config.host ?? '').replace(/\./g, '_')
      client.write({ screeps: { [user.username]: { stats: { [this.config.shard]: { [this.config.prefix]: stats } }, serverStats: { [host]: serverStats } } } }, (err: any) => {
        if (err !== undefined) logger.error(err)
      })
      return true
    } catch (error) {
      logger.error(error)
    }
  }
}
