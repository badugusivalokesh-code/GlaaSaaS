import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

const normalizeOrigin = (value?: string): string | undefined => {
  if (!value) return undefined;
  return value.replace(/\/$/, '');
};

const clientOrigins = Array.from(
  new Set(
    [
      normalizeOrigin(process.env.CLIENT_URL),
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ].filter((value): value is string => Boolean(value))
  )
);

export function createApp(): Application {
  const app = express();

  // Trust Render's proxy so `secure` cookies work correctly in production.
  app.set('trust proxy', 1);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
          return;
        }

        if (clientOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
