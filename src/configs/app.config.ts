// import { errorHandler } from "@/configs/error.config";
import routers from "@/routers/routers";
import env from "@/utils/validateEnv.util";
import Cookieparser from "cookie-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import { pinoHttpOptions } from "@/configs/logger.config";
import { createServer, Server as HttpServer } from "http";
import SocketConfig from "@/configs/socket.config";
import connectDatabase from "@/configs/database.config";
import logger from "@/configs/logger.config";
import NotificationService from "@/services/notification.service.ts";
import { HttpException } from "@/exceptions/http-exception";
import { BaseHttpResponse } from "@/lib/base-http-response";
class AppConfig {
  private readonly app: Express;
  private readonly httpServer: HttpServer;
  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
  }
  private async init(): Promise<void> {
    await this.initDatabase();
    this.initMiddlewares();
    this.initSocket();
    this.initServices();
    this.initRoutes();
    this.initErrorHandlers();
  }
  private initSocket(): void {
    //khởi tạo socket
    SocketConfig.init(this.httpServer);
  }
  private initServices(): void {
    //khởi tạo các service đặc biệt
    NotificationService.init(SocketConfig.getIO());
  }
  private async initDatabase(): Promise<void> {
    await connectDatabase.connect();
  }
  private initErrorHandlers(): void {
    this.app.use(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      (err: HttpException, req: Request, res: Response, next: NextFunction) => {
        console.error("catch error handler4", err);
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        const errorCode = err.errorCode || null;
        const details = err.details || null;
        res
          .status(statusCode)
          .json(
            BaseHttpResponse.error(message, statusCode, errorCode, details)
          );
      }
    );
  }
  private initMiddlewares(): void {
    this.app.use(
      cors({
        origin: env.CLIENT_URL,
        credentials: true,
      })
    );
    this.app.use(Cookieparser());
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(pinoHttpOptions);
  }

  private initRoutes(): void {
    this.app.route("/").get((req: Request, res: Response) => {
      res.status(200).json({ message: "Welcome to Art Vault API" });
    });
    routers.forEach((router) => {
      this.app.use(router.path, router.router);
    });
  }

  public async start(): Promise<void> {
    try {
      await this.init();
      this.httpServer.listen(env.PORT, async () => {
        logger.info(`👌Server is running on http://localhost:${env.PORT}`);
      });
    } catch (e: any) {
      logger.error("💔 Failed to start server", e.message);
    }
  }
}

export default AppConfig;
