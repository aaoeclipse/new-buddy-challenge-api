import { Elysia } from "elysia";
import UserController from "./user/controller";
import { PrismaClient } from "@prisma/client";
import UserService from "./user/service";
import { DatabaseManager } from "./database/model";
import { AuthService } from "./auth/service";
import { AuthController } from "./auth/controller";

// Database Service
const prisma = new PrismaClient();

// Database Manager
const dbManager = new DatabaseManager(prisma);

// User
const userService = new UserService(dbManager);
const userController = new UserController(userService);

// Auth
const authService = new AuthService(dbManager);
const authController = new AuthController(authService);

const app = new Elysia()
  .use(userController.userController)
  .use(authController.authController)
  .onError(({ code }) => {
    if (code === "NOT_FOUND") return "Route not supported.";
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
