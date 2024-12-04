import { test, expect, describe } from "bun:test";
import UserController from "../user/controller";
import UserService from "../user/service";
import { DatabaseManager } from "../database/model";
import { PrismaClient } from "@prisma/client";

describe("User tests", () => {
  const prisma = new PrismaClient();

  const databaseManager = new DatabaseManager(prisma);
  const userService = new UserService(databaseManager);
  const userController = new UserController(userService);

  test.todo("Create user", () => {});

  test.todo("Get all users", () => {});

  test.todo("Login as User", () => {});


});
