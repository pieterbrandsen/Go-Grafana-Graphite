import GetPool from './pool.js'
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/queryError.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/query.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

export default async function Query<T extends User | Config> (query: string): Promise<T[]> {
  const pool = GetPool()
  const client = await pool.connect()
  try {
    const res = await client.query(query)
    logger.info(`Query: ${query} executed successfully`)
    return res.rows
  } catch (error: any) {
    logger.error(`Query: ${query} failed with error: ${error}`)
    return []
  } finally {
    client.release()
  }
}

export class Users {
  // eslint-disable-next-line
  static async GetUser (user_id: number): Promise<User> {
    const query = `
            SELECT * FROM users
            WHERE user_id = ${user_id};
        `
    const res = await Query<User>(query)
    return res[0]
  }

  static async GetUsers (): Promise<User[]> {
    const query = `
        SELECT * FROM users;
        `
    const res = await Query<User>(query)
    return res
  }

  static async CreateUser (user: User): Promise<User> {
    const query = `
        INSERT INTO users (username, password)
        VALUES ('${user.username}', '${user.password}')
        RETURNING *;
        `
    const res = await Query<User>(query)
    return res[0]
  }

  static async UpdateUser (user: User): Promise<User> {
    const query = `
        UPDATE users SET username = '${user.username}', password = '${user.password}' WHERE user_id = ${user.user_id};
        `
    const res = await Query<User>(query)
    return res[0]
  }

  static async DeleteUser (user: User): Promise<User> {
    const query = `
        DELETE FROM users WHERE user_id = ${user.user_id};
        `
    const res = await Query<User>(query)
    return res[0]
  }
}

export class Configs {
  // eslint-disable-next-line
  static async GetConfig (config_id: number): Promise<Config> {
    const query = `
            SELECT * FROM configs
            WHERE config_id = ${config_id}
        `
    const res = await Query<Config>(query)
    return res[0]
  }

  static async GetConfigs (): Promise<Config[]> {
    const query = `
        SELECT * FROM configs;
        `
    const res = await Query<Config>(query)
    return res
  }

  static async CreateConfig (config: Config): Promise<Config> {
    const query = `
        INSERT INTO configs (user_id, config_name, interval, host, port, prefix, stats_path, stats_segment, shard, token, username, privateServerPassword, is_private_server, is_stats_segment)
        VALUES (${config.user_id}, '${config.config_name}', ${config.interval}, '${config.host}', ${config.port}, '${config.prefix}', '${config.stats_path}', '${config.stats_segment}', '${config.shard}', '${config.token}', '${config.username}', '${config.privateServerPassword}', ${config.is_private_server}, ${config.is_stats_segment})
        RETURNING *;
        `
    const res = await Query<Config>(query)
    return res[0]
  }

  static async UpdateConfig (config: Config): Promise<Config> {
    const query = `
        UPDATE configs SET user_id = ${config.user_id}, config_name = '${config.config_name}', interval = ${config.interval}, host = '${config.host}', port = ${config.port}, prefix = '${config.prefix}', stats_path = '${config.stats_path}', stats_segment = '${config.stats_segment}', shard = '${config.shard}', token = '${config.token}', username = '${config.username}', privateServerPassword = '${config.privateServerPassword}', is_private_server = ${config.is_private_server}, is_stats_segment = ${config.is_stats_segment} WHERE config_id = ${config.config_id};
        `
    const res = await Query<Config>(query)
    return res[0]
  }

  static async DeleteConfig (config: Config): Promise<Config> {
    const query = `
        DELETE FROM configs WHERE config_id = ${config.config_id};
        `
    const res = await Query<Config>(query)
    return res[0]
  }
}
