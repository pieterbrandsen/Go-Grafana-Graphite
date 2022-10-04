import express from "express";
import bodyParser from "body-parser";
import deletePath from "./deletePath.js";

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

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/deletePath", (req, res) => {
    logger.info(`${req.ip}, DeletePath called with path: ${req.body.path} by user: ${req.body.username}`);
    const result = deletePath(req.body.path);
    logger.info(`${req.body.path}, Result: ${JSON.stringify(result)}`);
    res.status(result.code).send(result.message);
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});