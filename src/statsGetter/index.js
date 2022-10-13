import "./postgres/init.js";
import { CronJob } from 'cron';
import SyncConfigs, { UpdateConfigUpdateTime } from "./updater/sync.js";
const configs = await SyncConfigs([]);
import HandleStatsGetter from "./updater/handleStatsGetter.js";

new CronJob(
    '*/5 * * * *',
    () => {
        SyncConfigs(configs);
    }
).start();

new CronJob(
    '*/5 * * * * *',
    () => {
        let i = 0;
        while (configs[0].nextUpdate && configs[0].nextUpdate < new Date().getTime()) {
            i++;
            const config = configs[0];
            new HandleStatsGetter(config).Start();
            UpdateConfigUpdateTime(configs, config);
        };
    }
).start();

setInterval(function() {
    console.log("Configs: " + configs.length);
}, 1000 * 60 * 60);