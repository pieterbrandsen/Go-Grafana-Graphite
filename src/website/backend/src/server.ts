import express from 'express'
import dotenv from 'dotenv'
dotenv.config() 
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

const clientId = process.env.GITHUB_OAUTH_CLIENT_ID || "";
const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET || "";
const host = process.env.FRONTEND_URL;

async function GetAccessToken(code:string) {
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
    return userResponse.data;
  } catch (error) {
    logger.error(`GetGithubUser error: ${JSON.stringify(error)}`)
    return {}
  }
}

app.get("/api/sessions/oauth/github", async (req, res) => {
  logger.info(`api/sessions/oauth/github called with code: ${req.query.code}`)
  const code = req.query.code as string;
  let username = undefined;
  let email = undefined;
  let id = undefined;

  let message = "";

  try {
    const access_token = await GetAccessToken(code);
    if (!access_token || typeof access_token !== "string") throw new Error("No access token returned");
    
    const userResponse = await GetGithubUser(access_token);
    username = userResponse.login;
    email = userResponse.email;
    id = userResponse.id;

    const getUserResponse = await axios.get(`http://custom-api:8000/getUser?username=${username}`)
    logger.info(`customApi/getUser response: ${JSON.stringify(getUserResponse.data)}`)
    if (getUserResponse.status !== 200 && username) {
      const setupUserResponse = await axios.post(`http://custom-api:8000/setupUser`, {
        username,
        email,
        code
      })
      logger.info(`customApi/setupUser response: ${JSON.stringify(setupUserResponse.data)}`)
    }
    message = "Successfully logged in! You can go back to what you wanted to do now.";
  } catch (error) {
    message = "Something went wrong :( Please try again later and contact me if the problem persists.";
    logger.error(`api/sessions/oauth/github error: ${JSON.stringify(error)}`)
  }
  finally {
    logger.info(`api/sessions/oauth/github redirecting to ${host}/login?username=${username}&id=${id}&message=${message}`)
    // TODO: use 'secure' option for cookies to use https
    res.cookie("username", username);
    res.cookie("id", id);
    res.cookie("message", message);
    res.redirect(`${host}/#/login`);
  }
});

const port = 8081
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
