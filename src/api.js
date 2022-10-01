const express = require("express");
const bodyParser = require("body-parser");
const graphite = require("graphite");
const client = graphite.createClient('plaintext://relay:2003');
const winston = require("winston");

const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function Write(obj) {
    let message = "OK"
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          client.write(obj, function(err) {
            if (err) logger.error(err);
        });
        }, 10*1000);
        // client.end();
        resolve(message);
      });
}

app.post("/", async (req, res) => {
    const response = await Write(req.body);
    res.send(response);
});

const port = 8080;
app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});