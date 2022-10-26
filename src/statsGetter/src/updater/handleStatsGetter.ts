import util from "util";
import zlib from "zlib";
import axios from "axios";
import graphite from "graphite";
import { Users } from "../postgres/query";
import winston from "winston";
import net from "net";
import {
  ConvertServerStats,
  ConvertAdminUtilsServerStats,
} from "./serverStats";
if (process.env.CARBON_RELAY_NG_URL === undefined) {
  process.env.CARBON_RELAY_NG_URL = "http://localhost:2003";
}
const client = graphite.createClient(
  `plaintext://${process.env.CARBON_RELAY_NG_URL.replace("http://", "")}/`
);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "logs/statsGetter/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "logs/statsGetter/combined.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

const maxTime = new Promise((resolve) => {
  setTimeout(resolve, 10 * 1000, {
    status: 408,
    statusText: "Request timed out!",
  });
});

export default class HandleStatsGetter {
  config: Config;
  host: string;
  constructor(config: Config) {
    this.config = config;
    this.host = this.GetHost();
  }

  GetHost(): string {
    if (this.config.is_private_server) {
      return `http://${this.config.host as string}:${
        this.config.port as number
      }`;
    }
    return "https://api.screeps.com:443";
  }

  async req(path: string, method = "GET", body = {}): Promise<any> {
    const headers: StringMap<string> = {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    };
    if (this.config.username !== undefined)
      headers["X-Username"] = this.config.username;
    if (this.config.token !== undefined) headers["X-Token"] = this.config.token;
    const options = {
      method,
      url: `${this.host}${path}`,
      headers,
      data: body,
    };

    const executeReq = new Promise((resolve) => {
      try {
        axios
          .request(options)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            resolve({ error });
          });
      } catch (error) {
        resolve({ error });
      }
    });

    return await Promise.race([executeReq, maxTime]).then((result: any) => {
      if (result.error !== undefined) {
        logger.error(`Error: ${path}, ${JSON.stringify(result.error)}`);
        return undefined;
      }

      if (result.status !== 200) {
        logger.error(`Failed: ${path}, ${JSON.stringify(result)}`);
        return undefined;
      }
      return result;
    });
  }

  async gz(data: string): Promise<any> {
    if (data === undefined) return {};
    const gunzipAsync = util.promisify(zlib.gunzip);
    const buf = Buffer.from(data.slice(3), "base64");
    const ret = await gunzipAsync(buf);
    return JSON.parse(ret.toString());
  }

  async GetPrivateServerToken(): Promise<any> {
    const res = await this.req("/api/auth/signin", "POST", {
      email: this.config.username,
      password: this.config.private_server_password,
    });
    return res.data.token;
  }

  async TestHost(host: string, port: number): Promise<any> {
    const executeReq = new Promise((resolve) => {
      try {
        const sock = new net.Socket();
        sock.setTimeout(2500);
        // eslint-disable-next-line no-loop-func
        sock
          .on("connect", () => {
            sock.destroy();
            resolve(true);
          })
          .on("error", () => {
            console.log("error", host);
            sock.destroy();
            resolve(false);
          })
          .on("timeout", () => {
            console.log("timeout", host);
            sock.destroy();
            resolve(false);
          })
          .connect(port, host);
      } catch (error) {
        resolve(false);
      }
    });

    return await Promise.race([executeReq, maxTime]).then((result: any) => {
      return result;
    });
  }

  async GetMemory(): Promise<any> {
    const statsPath = this.config.stats_path;
    const shard = this.config.shard;

    const res = await this.req(
      `/api/user/memory?path=${statsPath}&shard=${shard}`,
      "GET"
    );
    const data = await this.gz(res.data.data);
    return data;
  }

  async GetMemorySegment(): Promise<any> {
    const statsSegment = this.config.stats_segment;
    const shard = this.config.shard;

    const res = await this.req(
      `/api/user/memory-segment?segment=${statsSegment}&shard=${shard}`,
      "GET"
    );
    if (res.data == null) return {};
    try {
      const data = JSON.parse(res.data);
      return data;
    } catch (error) {
      return {};
    }
  }

  async GetLeaderboard(): Promise<any> {
    const res = await this.req(
      `/api/leaderboard/find?username=${this.config.username}&mode=world`,
      "GET"
    );
    const leaderboard = res.data.list;
    if (leaderboard.length === 0) return undefined;
    const { rank, score } = leaderboard.slice(-1)[0];
    return { rank, score };
  }

  async getUsers(): Promise<any> {
    const res = await this.req("/api/stats/users", "GET");
    return res;
  }

  async getRoomsObjects(): Promise<any> {
    const res = await this.req("/api/stats/rooms/objects", "GET");
    return res;
  }

  async getAdminUtilsServerStats(): Promise<any> {
    const res = await this.req("/stats", "GET");
    return res;
  }

  ValidateConfig(): boolean {
    if (!this.config.is_private_server) return true;
    if (
      this.config.is_private_server &&
      this.config.username !== undefined &&
      this.config.private_server_password !== undefined &&
      this.config.host !== undefined
    )
      return true;
    return false;
  }

  RemoveNonNumberValues(stats?: any) {
    if (stats === undefined) return {};
    for (const key in stats) {
      if (typeof stats[key] === "object") {
        stats[key] = this.RemoveNonNumberValues(stats[key]);
      } else if (isNaN(stats[key])) {
        delete stats[key];
      }
    }
    return stats;
  }

  ValidateStats(stats: any): boolean {
    if (stats === undefined) return false;
    if (typeof stats !== "object") return false;
    if (Object.keys(stats).length === 0) return false;
    return true;
  }

  async Start(): Promise<any> {
    const config = this.config;
    if (!this.ValidateConfig()) {
      logger.error(
        `Invalid config for ${config.username}-${config.shard}-${config.user_id}`
      );
      return;
    }
    const isPrivateServerHostOnline =
      config.is_private_server &&
      (await this.TestHost(config.host || "", config.port || 21025));
    if (config.is_private_server && !isPrivateServerHostOnline) {
      logger.error(
        `${config.config_id} - ${config.host}:${config.port} is offline`
      );
      return;
    }

    if (config.is_private_server) {
      const token = await this.GetPrivateServerToken();
      if (token === undefined) {
        logger.error(
          `Failed to get token for ${config.username}-${config.shard}-${config.user_id}`
        );
        return;
      }
      config.token = token;
    }

    const leaderboard = await this.GetLeaderboard();
    const memory = !config.is_stats_segment
      ? await this.GetMemory()
      : await this.GetMemorySegment();
    if (leaderboard === undefined || memory === undefined) {
      logger.error(
        `Failed to get leaderboard or memory for ${config.username}-${config.shard}-${config.user_id}, ${leaderboard}, ${memory}`
      );
      return;
    }
    memory.leaderboard = leaderboard;

    let serverStats;
    let adminUtilsServerStats;

    if (config.include_server_stats) {
      const users = await this.getUsers();
      const roomsObjects = await this.getRoomsObjects();
      if (users !== undefined && roomsObjects !== undefined)
        serverStats = ConvertServerStats(users.data, roomsObjects.data);

      const adminUtilsServerStatsRes = await this.getAdminUtilsServerStats();
      adminUtilsServerStats = ConvertAdminUtilsServerStats(
        adminUtilsServerStatsRes
      );
    }

    const result = await this.Report(
      memory,
      serverStats,
      adminUtilsServerStats
    );
    logger.info(
      `Reported ${config.username}-${config.shard}-${config.user_id} ${
        serverStats !== undefined || adminUtilsServerStats !== undefined
          ? "with serverStats"
          : ""
      }, ${result}`
    );
  }

  async Report(
    stats: any,
    serverStats: any,
    adminUtilsServerStats: any
  ): Promise<boolean> {
    let statsObj = stats;
    let serverStatsObj = serverStats;
    let adminUtilsServerStatsObj = adminUtilsServerStats;

    try {
      const user = await Users.GetUser(this.config.user_id);
      if (user === undefined) {
        logger.info(`User ${this.config.user_id} not found`);
        return false;
      } else if (user.email === undefined) {
        logger.info(`User ${this.config.user_id} has no email`);
        return false;
      }
      const host = (this.config.host ?? "").replace(/\./g, "_");
      const userStats: StringMap<any> = {};

      statsObj = this.RemoveNonNumberValues(statsObj);
      const validStats = this.ValidateStats(statsObj);
      if (validStats)
        userStats["stats"] = {
          [this.config.shard]: { [this.config.prefix]: statsObj },
        };

      serverStatsObj = this.RemoveNonNumberValues(serverStatsObj);
      const validServerStats = this.ValidateStats(serverStatsObj);
      if (validServerStats)
        userStats["serverStats"] = { [host]: serverStatsObj };

      adminUtilsServerStatsObj = this.RemoveNonNumberValues(
        adminUtilsServerStatsObj
      );
      const validAdminUtilsServerStats = this.ValidateStats(
        adminUtilsServerStatsObj
      );
      if (validAdminUtilsServerStats)
        userStats["adminUtilsServerStats"] = {
          [host]: adminUtilsServerStatsObj,
        };

      client.write(
        {
          screeps: {
            [user.email]: userStats,
          },
        },
        (err: any) => {
          if (err !== undefined) logger.error(err);
        }
      );
      return true;
    } catch (error) {
      logger.error(error);
      return false
    }
  }
}
