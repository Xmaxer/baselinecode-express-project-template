import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import express from 'express';
import https from 'https';

import Environment from '@utils/environment.mjs';
import logger from '@utils/logger.mjs';

dayjs.extend(utc);
const corsOrigins = [];

if (Environment.NODE_ENV === 'local') {
  corsOrigins.push('http://localhost:5173');
}

const corsPolicy = {
  credentials: true,
  origin: corsOrigins,
};

async function startServer() {
  const app = express();
  const httpServer = https.createServer(app);

  app.get('/health', (req, res) => {
    res.status(200).send('Okay!');
  });

  app.use((req, res, next) => {
    const start = performance.now();

    const measure = () => {
      const end = performance.now();
      logger.info(`Performance of full request execution:`, {
        query: req.body?.query,
        variables: req.body?.variables,
        timeTakenMs: end - start,
      });
    };

    res.on('close', measure);

    next();
  });

  app.use(cookieParser());
  app.use(cors(corsPolicy));
  app.use(bodyParser.json());

  //Routes here

  httpServer.listen({ port: Environment.SERVER_PORT }, () => {
    logger.info(`Server listening on port ${Environment.SERVER_PORT}`);
  });
}

startServer();
