import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config("./.env")
import express from "express";
const app = express();
import pkg from 'body-parser';
const { json } = pkg;
import cors from "cors";
import axios from 'axios';

const host = process.env.FRONTEND_URL;
const port = 8081;
app.use(cors());
app.use(json());

const clientVueID = process.env.GITHUB_VUE_OAUTH_CLIENT_ID;
const clientVueSecret = process.env.GITHUB_VUE_OAUTH_CLIENT_SECRET;

const clientGrafanaID = process.env.GITHUB_GRAFANA_OAUTH_CLIENT_ID;
const clientGrafanaSecret = process.env.GITHUB_GRAFANA_OAUTH_CLIENT_SECRET;

async function GetAccessToken(code, clientId, clientSecret) {
  try {
    const loginResponse = await axios({
      method: 'post',
      url: `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
      // Set the content type header, so that we get the response in JSON
      headers: {
        accept: 'application/json'
      }
    })
    return loginResponse.data.access_token;
  } catch (error) {
    return error.response;
  }
}

async function GetGithubUser(accessToken) {
  try {
    const userResponse = await axios({
      method: 'get',
      url: `https://api.github.com/user`,
      headers: {
        Authorization: 'token ' + accessToken
      }
    })
    return userResponse.data;

  } catch (error) {
    return { username: undefined, email: undefined }
  }
}

app.get("/api/sessions/oauth/github", async (req, res) => {
  try {
    const access_token = await GetAccessToken(req.query.code, clientVueID, clientVueSecret);
    if (!access_token || typeof access_token !== "string") throw new Error("No access token returned");
    const userResponse = await GetGithubUser(access_token);
    res.redirect(`${host}/login?username=${userResponse.login}&email=${userResponse.email}&from=${req.query.state}`);
  } catch (error) {
    res.redirect(`${host}/login?from=${req.query.state}`);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});