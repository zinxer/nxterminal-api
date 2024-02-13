import http from 'http';
import express, { Request, Response, NextFunction } from 'express';
import sequelize from './config/database'; // Adjust the path as needed
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import requestIp from 'request-ip';
import routes from './src/routes';
import 'dotenv/config';
import * as path from 'path';

const app = express();

// Determine CORS options based on NODE_ENV
const corsOptions = process.env.NODE_ENV === 'development'
  ? { origin: '*' } // Allow all origins in development
  : {
      origin: process.env.HOST, // Only allow requests from specific host in production
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204
    };

// Apply CORS middleware globally with the determined options
app.use(cors(corsOptions));

// Trust proxy settings based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', true); // Trust first proxy
} else {
  app.set('trust proxy', 'loopback'); // Development settings
}

// Middleware setup for parsing request bodies and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static assets before any other middleware or routes
app.use('/assets', express.static(path.join(__dirname, '/src/assets')));

// Apply request IP middleware
app.use(requestIp.mw());

// Routes setup
app.use('/terminal', routes);

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Error handling middleware, should be defined last, after other app.use() and routes calls
function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  // Use type assertion to access custom properties added at runtime
  const error = err as Error & { status?: number, type?: string };

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.error('-E- Bad JSON');
    res.status(400).send({
      success: false,
      error: { code: "INVALID_JSON_FORMAT" },
      message: "Invalid request format."
    });
  } else {
    next(error);
  }
}
app.use(errorHandler);

// Database connection check and server start
sequelize.authenticate()
  .then(() => {
    console.log("\x1b[32m%s\x1b[0m", '-I- SQL connected!');
    server.listen(PORT, () => {
      console.log("\x1b[32m%s\x1b[0m", `-I- Server is listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("\x1b[31m%s\x1b[0m", '-E- Unable to connect to the SQL database:', err);
    process.exit(1);
  });
