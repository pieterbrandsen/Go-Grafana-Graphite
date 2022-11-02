import './postgres/init.js'
import { CronJob } from 'cron'
import SyncConfigs, { UpdateConfigUpdateTime } from './updater/sync'
import HandleStatsGetter from './updater/handleStatsGetter'
import path from 'path'
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
dotenv.config();

const clientSecret = process.env.CLIENT_SECRET || "";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.get("/api/test", async (req, res) => {
  if (clientSecret === req.query.clientSecret) return "Not authorized";
  const config = req.query.config as unknown as Config;
  const statsGetter = new HandleStatsGetter(config);
  const hostOnline = await statsGetter.TestHost();
  if (!hostOnline) return "Host is not successfully pinged";
  const tokenOnline = await statsGetter.TestToken();
  return tokenOnline ? "Connection is successful" : "Connection is not successful";
});

app.listen(3000, () => {
  console.log('Listening on port 3000')
})