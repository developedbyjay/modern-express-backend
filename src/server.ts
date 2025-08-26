import type { CorsOptions } from 'cors';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import limiter from './lib/rate_limit.ts';

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

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});
