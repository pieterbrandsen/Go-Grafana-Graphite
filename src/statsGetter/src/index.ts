import './postgres/init.js'
import { CronJob } from 'cron'
import SyncConfigs, { UpdateConfigUpdateTime } from './updater/sync'
import HandleStatsGetter from './updater/handleStatsGetter'
import path from 'path'

let configs: Config[] = []
global.__dirname = path.resolve('./')

new CronJob('*/5 * * * * *', async () => {
  configs = await SyncConfigs(configs)
}).start()

new CronJob('*/5 * * * * *', () => {
  if (configs.length === 0) {
    return
  }

  while (configs[0].nextUpdate < new Date().getTime()) {
    const config = configs[0]
    new HandleStatsGetter(config).Start()
    configs = UpdateConfigUpdateTime(configs, config)
  }
}).start()