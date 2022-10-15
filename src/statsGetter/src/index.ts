import './postgres/init.js'
import { CronJob } from 'cron'
import SyncConfigs, { UpdateConfigUpdateTime } from './updater/sync.js'
import HandleStatsGetter from './updater/handleStatsGetter.js'
import path from 'path'

import { Configs, Users } from './postgres/query'
let configs: Config[] = []
global.__dirname = path.resolve('./')

new CronJob('*/5 * * * * *', async () => {
  configs = await SyncConfigs(configs)
}).start()

new CronJob('*/5 * * * * *', () => {
  // new CronJob("*/5 * * * * *", () => {
  if (configs.length === 0) {
    return
  }

  while (configs[0].nextUpdate < new Date().getTime()) {
    const config = configs[0]
    new HandleStatsGetter(config).Start()
    configs = UpdateConfigUpdateTime(configs, config)
  }
}).start()

async function Start (): Promise<void> {
  const users = await Users.GetUsers()
  if (users.length === 0) {
    await Users.CreateUser({
      username: 'admin',
      password: 'admin'
    })

    await Configs.CreateConfig({
      config_name: 'localhost',
      interval: 6000,
      is_private_server: true,
      is_stats_segment: false,
      shard: 'performanceServer',
      stats_path: 'stats',
      user_id: 1,
      username: 'W1N1',
      host: 'localhost',
      port: 21025,
      prefix: 'prefix',
      private_server_password: 'password',
      nextUpdate: -1
    })
  }
}

setInterval(function () {
  Start()
}, 1000)
