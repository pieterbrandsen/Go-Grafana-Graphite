import GetPool from './pool.js';
import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs/queryError.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/query.log' }),
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    ],
});

export default async function Query(query) {
    const pool = GetPool();
    const client = await pool.connect();
    try {
        const res = await client.query(query);
        logger.info(`Query: ${query} executed successfully`);
        return res.rows;
    } catch (error) {
        logger.error(`Query: ${query} failed with error: ${error}`);
    }
    finally {
        client.release();
    }
}

export class Users {
    static async GetUser(user_id) {
        const query = `
            SELECT * FROM users
            WHERE user_id = ${user_id};
        `;
        return await Query(query);
    }
    static async GetUsers() {
        const query = `
        SELECT * FROM users;
        `;
        return await Query(query);
    }
    static async CreateUser(user) {
        const query = `
        INSERT INTO users (username, password)
        VALUES ('${user.username}', '${user.password}')
        RETURNING *;
        `;
        return await Query(query);
    }
    static async UpdateUser(user) {
        const query = `
        UPDATE users SET username = '${user.username}', password = '${user.password}' WHERE user_id = ${user.user_id};
        `;
        return await Query(query);
    }
    static async DeleteUser(user) {
        const query = `
        DELETE FROM users WHERE user_id = ${user.user_id};
        `;
        return await Query(query);
    }
}

export class Configs {
    static async GetConfig(config_id) {
        const query = `
            SELECT * FROM configs
            WHERE config_id = ${config_id}
        `;
        return await Query(query);
    }
    static async GetConfigs() {
        const query = `
        SELECT * FROM configs;
        `;
        return await Query(query);
    }
    static async CreateConfig(config) {
        const query = `
        INSERT INTO configs (user_id, config_name, interval, host, port, prefix, stats_path, stats_segment, token, privateServerUsername, privateServerPassword, is_private_server, is_stats_segment)
        VALUES (${config.user_id}, '${config.config_name}', ${config.interval}, '${config.host}', ${config.port}, '${config.prefix}', '${config.stats_path}', '${config.stats_segment}', '${config.token}', '${config.privateServerUsername}', '${config.privateServerPassword}', ${config.is_private_server}, ${config.is_stats_segment})
        RETURNING *;
        `;
        return await Query(query);
    }
    static async UpdateConfig(config) {
        const query = `
        UPDATE configs SET user_id = ${config.user_id}, config_name = '${config.config_name}', interval = ${config.interval}, host = '${config.host}', port = ${config.port}, prefix = '${config.prefix}', stats_path = '${config.stats_path}', stats_segment = '${config.stats_segment}', token = '${config.token}', privateServerUsername = '${config.privateServerUsername}', privateServerPassword = '${config.privateServerPassword}', is_private_server = ${config.is_private_server}, is_stats_segment = ${config.is_stats_segment} WHERE config_id = ${config.config_id};
        `;
        return await Query(query);
    }
    static async DeleteConfig(config) {
        const query = `
        DELETE FROM configs WHERE config_id = ${config.config_id};
        `;
        return await Query(query);
    }
}