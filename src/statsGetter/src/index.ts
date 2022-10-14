import "./postgres/init.js";
import { CronJob } from 'cron';
import SyncConfigs, { UpdateConfigUpdateTime } from "./updater/sync.js";
let configs: Config[] = [];
import HandleStatsGetter from "./updater/handleStatsGetter.js";

new CronJob(
    '*/5 * * * *',
    async () => {
        configs = await SyncConfigs(configs);
    }
).start();

new CronJob(
    '*/5 * * * * *',
    () => {
        if (configs.length === 0 || !configs[0].nextUpdate) {
            return;
        }

        while ((configs[0].nextUpdate || Infinity) < new Date().getTime()) {
            const config = configs[0];
            new HandleStatsGetter(config).Start();
            configs = UpdateConfigUpdateTime(configs, config);
        };
    }
).start();

async function Start() {
    configs = await SyncConfigs([]);
}
Start();

setInterval(function() {
    console.log("Configs: " + configs.length);
}, 1000 * 60 * 60);