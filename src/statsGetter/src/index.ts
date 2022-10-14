import './postgres/init.js'
import { CronJob } from 'cron'
import SyncConfigs, { UpdateConfigUpdateTime } from './updater/sync.js'
import HandleStatsGetter from './updater/handleStatsGetter.js'
import path from 'path'
let configs: Config[] = []
global.__dirname = path.resolve('./')

new CronJob(
  '*/5 * * * *',
  async () => {
    configs = await SyncConfigs(configs)
  }
).start()

new CronJob(
  '*/5 * * * * *',
  () => {
    if (configs.length === 0) {
      return
    }

    while (configs[0].nextUpdate < new Date().getTime()) {
      const config = configs[0]
      new HandleStatsGetter(config).Start()
      configs = UpdateConfigUpdateTime(configs, config)
    };
  }
).start()

async function Start (): Promise<void> {
  configs = await SyncConfigs([])
}
Start()

setInterval(function () {
  console.log(`Configs: ${configs.length}`)
}, 1000 * 60 * 60)
