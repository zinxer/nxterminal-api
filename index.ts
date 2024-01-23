import http from 'http';
import express from 'express';
import sequelize from './config/database'; // Update the path accordingly
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import requestIp from 'request-ip';
import { setupWebSocketManager } from './src/websocket/WebSocketManager';
import routes from './src/routes'

const app = express();
const server = http.createServer(app); // Create an HTTP server with Express app
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(requestIp.mw());

// Setup Routes
app.use(routes);

// Set up WebSocket handling
setupWebSocketManager(server); // Pass the HTTP server to WebSocket setup

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
