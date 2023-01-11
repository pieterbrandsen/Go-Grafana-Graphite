/* eslint-disable @typescript-eslint/restrict-plus-operands */
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "logs/serverStats/error.log",
      level: "error",
    }),
  ],
});

export function ConvertAdminUtilsServerStats(unfilteredStats: any) {
  try {
    if (unfilteredStats === undefined) return;
    const adminUtilsServerStats: any = unfilteredStats;
    const groupedAdminStatsUsers: any = {};
    adminUtilsServerStats.users.forEach((user: any) => {
      groupedAdminStatsUsers[user.username] = user;
    });
    adminUtilsServerStats.users = groupedAdminStatsUsers;
    delete adminUtilsServerStats.ticks.ticks;
    return adminUtilsServerStats;
  } catch (error) {
    logger.error(error);
    return undefined;
  }
}
