import util from 'util';
import zlib from 'zlib';
import axios from 'axios';
import graphite from 'graphite';
const client = graphite.createClient('plaintext://carbon-relay-ng:2003/');
import { Users } from "../postgres/query.js";
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  ],
});

export default class HandleStatsGetter {
  config;
  host;
  constructor(config) {
    this.config = config;
    this.host = this.GetHost()
  }

  GetHost() {
    if (this.config.is_private_server) {
      return `http://${this.config.host}:${this.config.port}/api`;
    }
    return 'https://api.screeps.com:443/api';
  }

  async req(path, method = 'GET', body = {}) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    };
    if (this.config.username) headers['X-Username'] = this.config.username;
    if (this.config.token) headers['X-Token'] = this.config.token;
    const options = {
      method,
      url: `${this.host}${path}`,
      headers,
      data: body,
    }
    const maxTime = new Promise((resolve) => {
      setTimeout(resolve, 10 * 1000, { status: 408, statusText: "Request timed out!" });
    });

    const executeReq = new Promise(async (resolve) => {
      try {
        const result = await axios.request(options);
        resolve(result);
      } catch (error) {
        resolve(error);
      }
    });

    return Promise.race([executeReq, maxTime])
      .then((result) => {
        // if (typeof result === 'string' && result.startsWith('Rate limit exceeded'));
        if (result.status !== 200) {
          logger.error(`Error: ${path}, ${result}`);
        }
        return result;
      })
  }

  async gz(data) {
    const gunzipAsync = util.promisify(zlib.gunzip);
    const buf = Buffer.from(data.slice(3), 'base64');
    const ret = await gunzipAsync(buf);
    return JSON.parse(ret.toString());
  }

  async GetPrivateServerToken() {
    const res = await this.req('/auth/signin', 'POST', {
      email: this.config.username,
      password: this.config.password,
    });
    if (res === undefined) return undefined;
    return res.data.token;
  }
  async GetMemory() {
    const statsPath = this.config.stats_path;
    const shard = this.config.shard;

    const res = await this.req(`/user/memory?path=${statsPath}&shard=${shard}`, 'GET');
    if (res === undefined) return undefined;
    const data = await this.gz(res.data.data);
    return data;
  }
  async GetLeaderboard() {
    const res = await this.req(`/leaderboard/find?username=${this.config.username}&mode=world`, 'GET');
    if (res === undefined) return undefined;
    const leaderboard = res.data.list;
    if (leaderboard.length === 0) return { rank: 0, score: 0 };
    const { rank, score } = leaderboardList.slice(-1)[0];
    return { rank, score };
  }

  validateConfig() {
    if (!this.config.is_private_server) return true;
    if (this.config.is_private_server && this.config.username && this.config.password) return true;
    return false;
  }

  async Start() {
    const config = this.config;
    if (!this.validateConfig()) {
      logger.error(`Invalid config for ${config.username}-${config.shard}-${config.user_id}`);
      return;
    };
    if (config.is_private_server) {
      const token = await this.GetPrivateServerToken();
      if (token === undefined) {
        logger.error(`Failed to get token for ${config.username}-${config.shard}-${config.user_id}`);
        return;
      };
      config.token = token;
    }

    const leaderboard = await this.GetLeaderboard();
    const memory = await this.GetMemory();
    if (leaderboard === undefined || memory === undefined) {
      logger.error(`Failed to get leaderboard or memory for ${config.username}-${config.shard}-${config.user_id}, ${leaderboard}, ${memory}`);
      return;
    };
    memory.leaderboard = leaderboard;
    const result = await this.Report(memory);
    logger.info(`Reported ${config.username}-${config.shard}-${config.user_id}, ${result}`);
  }

  async Report(stats) {
    try {
      const users = await Users.GetUser(this.config.user_id);
      if (users.length === 0) return undefined;
      const username = users[0].username;
      client.write({ screeps: { [username]: { [this.config.shard]: stats } } }, (err) => {
        if (err) logger.error(err);
      });
      return true;
    } catch (error) {
      logger.error(err);
    }
  }
}