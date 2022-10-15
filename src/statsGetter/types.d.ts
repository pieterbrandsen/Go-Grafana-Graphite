interface User {
    user_id?: number;
    username: string;
    password: string;
}
interface Config {
    config_id?: number;
    user_id: number;
    config_name: string;
    interval: number;
    host?: string;
    port?: number;
    prefix?: string;
    stats_path?: string;
    stats_segment?: string;
    shard:string;
    token?: string;
    username: string;
    private_server_password?: string;
    is_private_server: boolean;
    is_stats_segment: boolean;
    nextUpdate: number;
}
interface StringMap<T> { [key: string]: T; }
