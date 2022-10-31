import { Configs, Users } from './postgres/query'

const normalInterval = 60000;
async function GetInterval(userId: number): Promise<number> {
    const userConfigs = await Configs.GetConfigsByFilter(u=>u.user_id === userId);
    return (1 + userConfigs.length) * normalInterval;
}

async function ValidateConfig(config:Partial<Config>): Promise<Config | string> {
    if (!config) return "No config provided";
    if (!config.config_name || typeof config.config_name !== "string") return "Invlaid config_name";
    if (!config.user_id || typeof config.user_id !== "number") return "Invalid user_id";
    const user = Users.GetUser(config.user_id);
    if (!user) return "User does not exist";

    if (config.prefix && typeof config.prefix !== "string") return "Invalid prefix";
    if (!config.username || typeof config.username !== "string") return "Invalid username";
    if (config.is_private_server === undefined || typeof config.is_private_server !== "boolean") return "Invalid is_private_server";
    if (config.is_stats_segment === undefined || typeof config.is_stats_segment !== "boolean") return "Invalid is_stats_segment";

    // MMO
    if (!config.is_private_server) {
        config.interval = await GetInterval(config.user_id);
        if (!config.shard || typeof config.shard !== "string") return "Invalid shard";
        if (!config.is_stats_segment) {
            if (!config.stats_path) return "Invalid stats_path";
        }
        else if (typeof config.stats_segment !== "number") return "Invalid stats_segment";
        if (!config.token || typeof config.token !== "string") return "Invalid token";
    }
    // Private Server
    else {
        if (!config.host || typeof config.host !== "string") return "Invalid host";
        if (!config.port || typeof config.port !== "number") return "Invalid number";
        if (!config.interval || typeof config.interval !== "number") config.interval = normalInterval;
        if (config.interval < normalInterval || config.interval > normalInterval * 15) return "Out of range interval values";
        config.shard = "private";
        if (!config.private_server_password || typeof config.private_server_password !== "string") return "Invalid private_server_password";
        if (config.include_server_stats === undefined || typeof config.include_server_stats !== "boolean") return "Invalid include_server_stats";
    }
    return config as Config;
}

export async function CreateConfigModel(config:Partial<Config>): Promise<Config | string> {
    return await ValidateConfig(config);
}

export async function UpdateConfigModel(config:Partial<Config>): Promise<Config | string> {
    return await ValidateConfig(config);
}