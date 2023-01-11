/* eslint-disable */
export interface NavigationItem {
    label: string;
    path: string;
}

export interface StringMap<T> {
    [key: string]: T;
}

export interface Config {
    config_id?: number;
    user_id: number;
    config_name: string;
    interval: number;
    host?: string;
    port?: number;
    prefix: string;
    stats_path?: string;
    stats_segment?: number;
    shard:string;
    token?: string;
    username: string;
    private_server_password?: string;
    include_server_stats: boolean;
    is_private_server: boolean;
    is_stats_segment: boolean;
    active: boolean;
    nextUpdate: number;
}