require('dotenv').config();

const assert = require('assert');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('winston');

assert(process.env.PORT, 'process.env.PORT is missing.');

winston.add(new winston.transports.Console());

const app = express();

app.set('port', process.env.PORT);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        (process.env.CORS_ALLOWLIST || '').split(',').includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS.'));
      }
    },
  })
);

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.json({ message: `The timestamp is ${new Date().toISOString()}.` });
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

const server = app.listen(app.get('port'), () => {
  winston.info(`Listening on port ${server.address().port}...`);
});
