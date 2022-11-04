import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import winston from "winston";
import axios from "axios";
import { Configs, Users } from "./postgres/query";
import { ValidateConfig } from "./configHelper";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const clientId = process.env.GITHUB_OAUTH_CLIENT_ID || "";
const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET || "";
const host = process.env.FRONTEND_URL;

async function AuthorizeUser(query: any) {
  const { githubUserId, config } = query;
  if (!githubUserId || !config)
    return {
      code: 400,
      message: "Bad Request, missing githubUserId or config",
    };
  const githubUserIdNumber = parseInt(githubUserId as string);
  if (isNaN(githubUserIdNumber))
    return { code: 400, message: "Bad Request, githubUserId is not a number" };
  const user = (
    await Users.GetUsersByFilter((u) => u.github_user_id === githubUserIdNumber)
  )[0];
  if (!user) return { code: 400, message: "Bad Request, user not found" };
  return undefined;
}

app.post("/api/config/create", async (req, res) => {
  const authorizeUserResult = await AuthorizeUser(req.query);
  if (authorizeUserResult !== undefined)
    return res
      .status(authorizeUserResult.code)
      .send(authorizeUserResult.message);
  const config = req.query.config as Partial<Config>;
  const githubUserIdNumber = parseInt(req.query.githubUserId as string);
  const user = (
    await Users.GetUsersByFilter((u) => u.github_user_id === githubUserIdNumber)
  )[0];

  if (config.user_id !== user.user_id)
    return res
      .status(400)
      .send("Bad Request, user.user_id does not match config.user_id");

  const configModel = await ValidateConfig(config);
  if (typeof configModel === "string")
    return res
      .status(400)
      .send("Bad Request, config is not valid: " + configModel);

  const result = await Configs.CreateConfig(configModel);
  logger.info(`create ${configModel.config_id} ${result}`);
  if (!result) return res.status(500).send("Internal Server Error");
  return res.status(200).send("OK");
});

app.put("/api/config/update", async (req, res) => {
  const authorizeUserResult = await AuthorizeUser(req.query);
  if (authorizeUserResult !== undefined)
    return res
      .status(authorizeUserResult.code)
      .send(authorizeUserResult.message);
  const config = req.query.config as Partial<Config>;
  const githubUserIdNumber = parseInt(req.query.githubUserId as string);
  const user = (
    await Users.GetUsersByFilter((u) => u.github_user_id === githubUserIdNumber)
  )[0];

  const configModelInDb = (
    await Configs.GetConfigsByFilter(
      (c) => c.config_id === config.config_id && c.user_id === user.user_id
    )
  )[0];
  if (!configModelInDb)
    return res.status(400).send("Bad Request, config not found");

  const configModel = await ValidateConfig(config);
  if (typeof configModel === "string")
    return res
      .status(400)
      .send("Bad Request, config is not valid: " + configModel);

  const result = await Configs.UpdateConfig(configModel);
  logger.info(`update ${configModel.config_id} ${result}`);
  if (!result) return res.status(500).send("Internal Server Error");
  return res.status(200).send("OK");
});

app.delete("/api/config/delete", async (req, res) => {
  const authorizeUserResult = await AuthorizeUser(req.query);
  if (authorizeUserResult !== undefined)
    return res
      .status(authorizeUserResult.code)
      .send(authorizeUserResult.message);
  const configId = req.query.configId as unknown as number;

  const githubUserIdNumber = parseInt(req.query.githubUserId as string);
  const user = (
    await Users.GetUsersByFilter((u) => u.github_user_id === githubUserIdNumber)
  )[0];

  const configModelInDb = (
    await Configs.GetConfigsByFilter(
      (c) => c.config_id === configId && c.user_id === user.user_id
    )
  )[0];
  if (!configModelInDb)
    return res.status(400).send("Bad Request, config not found");

  const result = await Configs.DeleteConfig(configId);
  logger.info(`delete ${configId} ${result}`);
  if (!result) return res.status(500).send("Internal Server Error");
  return res.status(200).send("OK");
});

app.post("/api/config/getAll", async (req, res) => {
  const authorizeUserResult = await AuthorizeUser(req.query);
  if (authorizeUserResult !== undefined)
    return res
      .status(authorizeUserResult.code)
      .send(authorizeUserResult.message);

  const githubUserIdNumber = parseInt(req.query.githubUserId as string);
  const user = (
    await Users.GetUsersByFilter((u) => u.github_user_id === githubUserIdNumber)
  )[0];

  const result = await Configs.GetConfigsByFilter(
    (c) => c.user_id === user.user_id
  );
  logger.info(`getAll ${githubUserIdNumber} ${result.length}`);
  if (!result) return res.status(500).send("Internal Server Error");
  return res.status(200).send(result);
});

app.get("/api/config/test", async (req, res) => {
  const authorizeUserResult = await AuthorizeUser(req.query);
  if (authorizeUserResult !== undefined)
    return res
      .status(authorizeUserResult.code)
      .send(authorizeUserResult.message);
  const config = req.query.config as Partial<Config>;
  const githubUserIdNumber = parseInt(req.query.githubUserId as string);
  const user = (
    await Users.GetUsersByFilter((u) => u.github_user_id === githubUserIdNumber)
  )[0];
  if (config.user_id !== user.user_id)
    return res
      .status(400)
      .send("Bad Request, user.user_id does not match config.user_id");

  const configModel = await ValidateConfig(config);
  if (typeof configModel === "string")
    return res
      .status(400)
      .send("Bad Request, config is not valid: " + configModel);

  const result = await axios.post("http://stats-getter:3000/api/test", {
    config: configModel,
    clientSecret: process.env.STATS_GETTER_CLIENT_SECRET,
  });

  logger.info(`test ${config.config_id} ${result.data}`);
  return res.status(result.status).send(result.data);
});

async function GetAccessToken(code: string) {
  try {
    const loginResponse = await axios({
      method: "post",
      url: `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
      // Set the content type header, so that we get the response in JSON
      headers: {
        accept: "application/json",
      },
    });
    return loginResponse.data.access_token;
  } catch (error: any) {
    logger.error(`GetAccessToken error: ${JSON.stringify(error)}`);
    return error.response;
  }
}

async function GetGithubUser(accessToken: string) {
  try {
    const userResponse = await axios({
      method: "get",
      url: `https://api.github.com/user`,
      headers: {
        Authorization: "token " + accessToken,
      },
    });
    return userResponse.data;
  } catch (error) {
    logger.error(`GetGithubUser error: ${JSON.stringify(error)}`);
    return {};
  }
}

app.get("/api/sessions/oauth/github", async (req, res) => {
  logger.info(`api/sessions/oauth/github called with code: ${req.query.code}`);
  const code = req.query.code as string;
  let username = undefined;
  let email = undefined;
  let id = undefined;
  let message = "";

  try {
    const access_token = await GetAccessToken(code);
    if (!access_token || typeof access_token !== "string")
      throw new Error("No access token returned");

    const userResponse = await GetGithubUser(access_token);
    username = userResponse.login;
    email = userResponse.email;
    id = userResponse.id;

    const getUserResponse = await axios.get(
      `http://custom-api:8000/getUser?username=${username}`
    );
    logger.info(
      `customApi/getUser response: ${JSON.stringify(getUserResponse.data)}`
    );
    if (getUserResponse.status !== 200 && username) {
      const setupUserResponse = await axios.post(
        `http://custom-api:8000/setupUser`,
        {
          username,
          email,
          code,
        }
      );
      logger.info(
        `customApi/setupUser response: ${JSON.stringify(
          setupUserResponse.data
        )}`
      );
    }

    const user = (
      await Users.GetUsersByFilter((u) => u.github_user_id === id)
    )[0];
    if (!user) {
      const userCreationResult = await Users.CreateUser({
        email,
        username,
        github_user_id: id,
      });
      if (!userCreationResult) {
        logger.error(
          `User creation failed for user setup:  ${email} ${username} ${id}`
        );
        message = "User creation failed";
      } else {
        message =
          "Successfully logged in! You can go back to what you wanted to do now.";
      }
    } else {
      logger.info(`db/getUser response: "User found"`);
    }
  } catch (error) {
    message =
      "Something went wrong :( Please try again later and contact me if the problem persists.";
    logger.error(`api/sessions/oauth/github error: ${JSON.stringify(error)}`);
  } finally {
    logger.info(
      `api/sessions/oauth/github redirecting to ${host}/login?username=${username}&id=${id}&message=${message}`
    );
    // TODO: use 'secure' option for cookies to use https
    res.cookie("username", username);
    res.cookie("id", id);
    res.cookie("message", message);
    res.redirect(`${host}/#/login`);
  }
});

const port = 8081;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
