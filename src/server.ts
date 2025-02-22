import { Server } from 'http';

import mongoose from 'mongoose';

import app from './app';
import config from './app/config';

let server: Server;

process.on('uncaughtException', (error: Error) => {
  console.log('🔥 Uncaught Exception detected...');
  console.log(error);
  process.exit(1);
});

async function connectDB() {
  await mongoose.connect(config.mongodb_uri as string);
  console.log('🛢 Database connection successful');
}

async function bootstrap() {
  try {
    await connectDB();

    server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
    });
  } catch (err) {
    console.error('😥 Failed to connect server:', err);
    process.exit(1);
  }

  process.on('unhandledRejection', (error: Error) => {
    console.log('🔥 Unhandled Rejection detected...');
    if (server) {
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    }
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received...');
    if (server) {
      server.close(() => {
        mongoose.connection.close().then(() => {
          process.exit(0);
        });
      });

      setTimeout(() => {
        console.log('Forcing shutdown...');
        process.exit(1);
      }, 5000);
    }
  });
}

bootstrap();
