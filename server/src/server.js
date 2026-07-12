import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { initSocket } from "./config/socket.js";
import { initSocketHandlers } from "./sockets/index.js";
import { logger } from "./utils/logger.js";

const startServer = async () => {
  await connectDB();

  const httpServer = http.createServer(app);
  const io = initSocket(httpServer);
  initSocketHandlers(io);

  httpServer.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  logger.error("Failed to start server:", error.message);
  process.exit(1);
});
