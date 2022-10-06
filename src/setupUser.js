import axios from 'axios';
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


const grafanaApiUrl = process.env.GRAFANA_URL+"/api";
const adminLogin = {
    username: process.env.GRAFANA_USER,
    password: process.env.GRAFANA_PASSWORD
}

async function GetOrg(name) {
    try {
        const result = await axios({
            url: `${grafanaApiUrl}/orgs/name/${name}`,
            method: 'get',
            auth: adminLogin,
        });
        return result.data;
    } catch (err) {
        logger.error(`GetOrg error! ${JSON.stringify(err)}`);
        return err.response;
    }
}

async function CreateUser(config) {
    try {
        const result = await axios({
            url: `${grafanaApiUrl}/admin/users`,
            method: 'post',
            auth: adminLogin,
            data: {
                name: config.username,
                email: config.email,
                login: config.username,
                password: config.password,
                orgId:undefined
            }
        });
        return result.data;
    } catch (err) {
        return err.response;
    }
}

async function SwitchToOrg(orgId,userLogin) {
    try {
        const result = await axios({
            url: `${grafanaApiUrl}/user/using/${orgId}`,
            method: 'post',
            auth: userLogin,
        });
        return result.data;
    } catch (err) {
        logger.error(`SwitchToOrg error! ${JSON.stringify(err)}`);
        return err.response;
    }
}

async function CreateDatasource(userLogin) {
    try {
        const result = await axios({
            url: `${grafanaApiUrl}/datasources`,
            method: 'post',
            auth: userLogin,
            data: {
                name: 'Graphite',
                type: 'graphite',
                url: 'http://gateway:8181',
                access: 'proxy',
                isDefault: true,
                jsonData: {
                    graphiteVersion: '1.1',
                    graphiteType: "default",
                    keepCookies: ["grafana_session"]
                }
              },
        });
        return result.data;
    } catch (err) {
        logger.error(`CreateDatasource error! ${JSON.stringify(err)}`);
        return err.response;
    }
}

async function CreateDashboard(userLogin) {
    try {
        const result = await axios({
            url: `${grafanaApiUrl}/dashboards/db`,
            method: 'post',
            auth: userLogin,
            data: {
                "dashboard": {
                    "id": null,
                    "uid": null,
                    "title": "Production Overview",
                    "tags": [ "templated" ],
                    "timezone": "browser",
                    "schemaVersion": 16,
                    "version": 0,
                    "refresh": "25s"
                  },
                  "message": "Made changes to xyz",
                  "overwrite": false
              },
        });
        return result.data;
    } catch (err) {
        logger.error(`CreateDashboard error! ${JSON.stringify(err)}`);
        return err.response;
    }
}

export default async function SetupUser(config) {
    config.username = config.username.toLowerCase();
    config.email = `${config.username}@${config.username}.com`;

    const userLogin = {
        username: config.username,
        password: config.password,
    }

    const user = await CreateUser(config);
    if (user.status) return { code: user.status, message: user.data.message };

    const org = await GetOrg(config.email);
    if (org.status) return { code: org.status, message: org.data.message };
    const orgId = org.id;    

    const switchToOrg = await SwitchToOrg(orgId, userLogin);
    if (switchToOrg.status) return { code: switchToOrg.status, message: switchToOrg.data.message };

    const datasource = await CreateDatasource(userLogin);
    if (datasource.status) return { code: datasource.status, message: datasource.data.message };

    const dashboard = await CreateDashboard(userLogin);
    if (dashboard.status !== "success") return { code: dashboard.status, message: dashboard.data.message };
    
    return { code: 200, message: "User setup successfully" };
}