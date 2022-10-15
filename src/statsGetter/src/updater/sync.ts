import lodash from 'lodash'
import { Configs } from '../postgres/query.js'
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/sync.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

function SortByNextUpdate (configs: Config[]): Config[] {
  return configs.sort((a: Config, b: Config) => {
    if (a.nextUpdate === undefined || b.nextUpdate === undefined) return -1
    return a.nextUpdate - b.nextUpdate
  })
}

export default async function SyncConfigs (
  configs: Config[]
): Promise<Config[]> {
  const dbConfigs = await Configs.GetConfigs()
  const newConfigs = lodash.differenceBy(dbConfigs, configs, 'config_id')
  const deletedConfigs = lodash.differenceBy(configs, dbConfigs, 'config_id')

  for (const config of newConfigs) {
    configs.push(config)
  }
  for (const config of deletedConfigs) {
    lodash.remove(configs, { config_id: config.config_id })
  }
  for (const config of configs) {
    if (config.nextUpdate === undefined) {
      config.nextUpdate = new Date().getTime()
    }
  }
  logger.info(
    `Synced configs. New configs: ${newConfigs.length}, deleted configs: ${deletedConfigs.length}, total configs ${configs.length}`
  )
  return SortByNextUpdate(configs)
}

export function UpdateConfigUpdateTime (configs: Config[], config: Config): Config[] {
  const index = lodash.findIndex(configs, { config_id: config.config_id })
  configs[index].nextUpdate = new Date().getTime() + config.interval
  return SortByNextUpdate(configs)
}
