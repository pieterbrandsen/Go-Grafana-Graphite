import express from 'express'
import bodyParser from 'body-parser'
import winston from 'winston'
import axios from 'axios'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const clientVueID = process.env.GITHUB_VUE_OAUTH_CLIENT_ID || "";
const clientVueSecret = process.env.GITHUB_VUE_OAUTH_CLIENT_SECRET || "";
const host = process.env.FRONTEND_URL;
async function GetAccessToken(code:string, clientId:string, clientSecret:string) {
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
  } catch (error:any) {
    logger.error(`GetAccessToken error: ${JSON.stringify(error)}`)
    return error.response;
  }
}

async function GetGithubUser(accessToken:string) {
  try {
    const userResponse = await axios({
      method: 'get',
      url: `https://api.github.com/user`,
      headers: {
        Authorization: 'token ' + accessToken
      }
    })
    console.log("userResponse", userResponse.data);
    return userResponse.data;
  } catch (error) {
    logger.error(`GetGithubUser error: ${JSON.stringify(error)}`)
    return { username: undefined, email: undefined }
  }
}

app.get("/api/sessions/oauth/github", async (req, res) => {
  logger.info(`api/sessions/oauth/github called with code: ${req.query.code}`)
  const code = req.query.code as string;
  const state = req.query.state as string;
  let username = "";
  let email = "";

  try {
    const access_token = await GetAccessToken(code, clientVueID, clientVueSecret);
    if (!access_token || typeof access_token !== "string") throw new Error("No access token returned");
    const userResponse = await GetGithubUser(access_token);
    username = userResponse.login;
    email = userResponse.email;
  } catch (error) {
    logger.error(`api/sessions/oauth/github error: ${JSON.stringify(error)}`)
  }
  finally {
    logger.info(`api/sessions/oauth/github redirecting to ${host}/#/login?username=${username}&email=${email}&state=${state}`)
    res.redirect(`${host}/login?username=${username}&email=${email}&state=${state}`);
  }
});

const port = 8081
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
