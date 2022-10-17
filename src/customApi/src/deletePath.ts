import fs from 'fs'
import { join } from 'path'
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/deletePath.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

const base = '/go-carbon-storage'

export default function deletePath (path?: string, orgName?: string): ApiResponse {
  if (path === undefined) return { code: 400, message: 'Path is required' }
  if (typeof path !== 'string') return { code: 400, message: 'Path must be a string' }

  if (orgName === undefined) return { code: 400, message: 'OrgName is required' }

  let fullPath = join(base, path.replace(/\./g, '/'))
  if (!fullPath.startsWith(base)) return { code: 400, message: 'Path must be within base' }

  if (!fs.existsSync(fullPath)) {
    if (fs.existsSync(fullPath + '.wsp')) fullPath += '.wsp'
    else return { code: 404, message: 'Path does not exist' }
  };

  if (!fullPath.startsWith(join(base, "/screeps/",orgName))) return { code: 400, message: 'Path must be within orgName' }

  logger.info(`Deleting ${fullPath}`)

  fs.rmSync(fullPath, { recursive: true })
  return { code: 200, message: 'Path deleted' }
}
