import http from 'http';
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import sequelize from './config/database'; // Update the path accordingly
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import requestIp from 'request-ip';
import routes from './src/routes'
import 'dotenv/config';
import * as path from 'path';

const app = express();
const server = http.createServer(app); // Create an HTTP server with Express app
const PORT = process.env.PORT || 3000;

// Defining the errorHandler as a function
function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    console.error('-E- Bad JSON');
    res.status(400).send({
      success: false,
      error: { code: "INVALID_JSON_FORMAT" },
      message: "Invalid request format."
    });
    return;
  }
  next();
}


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler)
app.use(cookieParser());
app.use(requestIp.mw());

// Setup Routes
app.use(routes);

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, '/src/assets')));

// set Express trust proxy and cors settings based on NODE_ENV
if (process.env.NODE_ENV === 'production') { app.set('trust proxy', true); app.use(cors({ origin: process.env.HOST })); }
if (process.env.NODE_ENV === 'development') { app.set('trust proxy', 'loopback'); app.use(cors()); }

// Check that database is authenticated
sequelize.authenticate()
  .then(() => {
    console.log("\x1b[32m%s\x1b[0m", '-I- SQL connected!');

    // Start the HTTP server, not the Express app
    server.listen(PORT, () => {
      console.log("\x1b[32m%s\x1b[0m", `-I- Server is listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("\x1b[31m%s\x1b[0m", '-E- Unable to connect to the SQL database:', err);
    process.exit();
  });