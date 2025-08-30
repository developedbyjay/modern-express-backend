import type { CorsOptions } from 'cors';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import limiter from '@src/lib/rate_limit';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';
import { logger } from '@src/lib/winston';

import v1Router from '@src/routes/v1/index.route';
import { normalizedQuery } from './middleware/normalizedQuery.middleware';

const app = express();
const PORT = process.env.PORT || 8080;

const corsOption: CorsOptions = {
  origin(origin, callback) {
    if (
      process.env.NODE_ENV === 'development' ||
      !origin ||
      (process.env.WHITELIST_ORIGINS &&
        process.env.WHITELIST_ORIGINS.includes(origin))
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS Error: ${origin} is not allowed by cors`),
        false,
      );
    }
  },
};

// It is used to serve as a mutation for the req.query which can't be mutated due to its getter function
app.use(normalizedQuery);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));
app.use(cookieParser());
app.use(
  compression({
    threshold: 1024,
  }),
);
app.use(helmet());
app.use(limiter);

(async () => {
  try {
    await connectToDatabase();

    app.use('/v1', v1Router);

    app.listen(PORT, () => {
      logger.info(`App running on ${PORT}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.info('Server is shutting down...');
    process.exit(0);
  } catch (error) {
    logger.error('Error shutting down server:', error);
  }
};

process.on('SIGINT', handleServerShutdown); // Handle Ctrl+C
process.on('SIGTERM', handleServerShutdown); // Handle termination signals
