import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';

import notFound from './app/middleware/notFound';
import routes from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      'https://car-store-client-ten.vercel.app',
      'http://localhost:5173',
    ],
    credentials: true,
  }),
);

// Welcome route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to our Car Store Server API',
    version: '1.0.0',
    API_documentation:
      'https://documenter.getpostman.com/view/31322920/2sAYdfrXUP',
    success: true,
  });
});

// application routes
app.use('/api', routes);

// not found handler
app.use(notFound);

// global error handler
app.use(globalErrorHandler);

export default app;
