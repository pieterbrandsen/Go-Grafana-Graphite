import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config("./.env")
import express from "express";
const app = express();
import pkg from 'body-parser';
const { json } = pkg;
import cors from "cors";
import axios from 'axios';

const port = 8081;
app.use(cors());
app.use(json());

const clientID = process.env.GITHUB_OAUTH_CLIENT_ID;
const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

app.get("/api/sessions/oauth/github", async (req, res) => {
  const requestToken = req.query.code
  
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    res.redirect(`/success?access_token=${response.data.access_token}&state=${req.query.state}`);
  })
});

app.get('/success', function(req, res) {
  const access_token = req.query.access_token;
  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token
    }
  }).then((response) => {
    res.redirect(`http://localhost:8080/login?username=${response.data.login}&email=${response.data.email}&from=${req.query.state}`);
  })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});