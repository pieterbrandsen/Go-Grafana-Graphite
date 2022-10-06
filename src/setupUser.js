import axios from 'axios';

// const grafanaApiUrl = process.env.GRAFANA_URL+"/api";
// const login = {
//     username: process.env.GRAFANA_USER,
//     password: process.env.GRAFANA_PASSWORD
// }
const grafanaApiUrl = "http://localhost:3000/api";
const login = {
    username: "admin",
    password: "password"
}

async function GetOrg(name) {
    try {
        const result = await axios({
            url: `${grafanaApiUrl}/orgs/name/${name}`,
            method: 'get',
            auth: login,
        });
        return result.data;
    } catch (err) {
        return err.response;
    }
}

async function CreateOrg(name) {
    try {
        const existingOrg = await GetOrg(name);
        if (existingOrg.status === 200) return existingOrg;

        const result = await axios({
            url: `${grafanaApiUrl}/orgs`,
            method: 'post',
            auth: login,
            data: {
                name
            }
        });
        return result.data;
    } catch (err) {
        return err.response;
    }
}
async function CreateUser(orgId,config) {
    try {
        const result = await axios({
            url: `${grafanaApiUrl}/admin/users`,
            method: 'post',
            auth: login,
            data: {
                name: config.username,
                email: `${config.username}@${config.username}.com`,
                login: config.username,
                password: config.password,
                OrgId:orgId
            }
        });
        return result.data;
    } catch (err) {
        return err.response;
    }
}

async function SwitchToOrg(orgId) {
    try {
        const result = await axios({
            url: `${grafanaApiUrl}/user/using/${orgId}`,
            method: 'post',
            auth: login,
        });
        return result.data;
    } catch (err) {
        return err.response;
    }
}

async function UpdateUserPermissions(userId) {
    try {
        const result = await axios({
            url: `${grafanaApiUrl}/admin/users/${userId}/permissions`,
            method: 'put',
            auth: login,
            data: {
                isGrafanaAdmin: false,
                orgRole: "Editor",
                globalPermissions: [],
              },
        });
        return result.data;
    } catch (err) {
        return err.response;
    }
}

async function AddUserToOrg(orgId,username) {
    try {
        const result = await axios({
            url: `${grafanaApiUrl}/orgs/${orgId}/users`,
            method: 'POST',
            auth: login,
            data: {
                loginOrEmail: username,
                role: "Editor"
            }
        });

        const result2 = await axios({
            url: `${grafanaApiUrl}/org/users`,
            method: 'get',
            auth: login,
        });
        return result.data;
    } catch (err) {
        return err.response;
    }
}

async function CreateDatasource() {
    try {
        const result = await axios({
            url: `${grafanaApiUrl}/datasources`,
            method: 'post',
            auth: login,
            data: {
                name: 'Graphite',
                type: 'graphite',
                url: 'http://carbonapi:8081',
                access: 'proxy',
                isDefault: true,
              },
        });
        return result.data;
    } catch (err) {
        return err.response;
    }
}

async function CreateDashboard() {
    try {
        const result = await axios({
            url: `${grafanaApiUrl}/dashboards/db`,
            method: 'post',
            auth: login,
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
        return err.response;
    }
}

export default async function SetupUser(config) {
    config.username = config.username.toLowerCase();

    const org = await CreateOrg(config.username);
    if (org.status) return { code: org.status, message: org.data.message };
    const orgId = org.orgId;    

    const user = await CreateUser(orgId,config);
    if (user.status) return { code: user.status, message: user.data.message };
    const userId = user.id;

    const switchToOrg = await SwitchToOrg(orgId);
    if (!switchToOrg) return { code: switchToOrg.status, message: switchToOrg.data.message };

    const userPermissions = await UpdateUserPermissions(userId);
    if (userPermissions.status) return { code: userPermissions.status, message: userPermissions.data.message };

    // const addUserToOrg = await AddUserToOrg(orgId,config.username);
    // if (addUserToOrg.status) return { code: addUserToOrg.status, message: addUserToOrg.data.message };

    const datasource = await CreateDatasource();
    if (datasource.status) return { code: datasource.status, message: datasource.data.message };
    
    const dashboard = await CreateDashboard();
    if (dashboard.status !== "success") return { code: dashboard.status, message: dashboard.data.message };
    
    return { code: 200, message: "User setup successfully" };
}