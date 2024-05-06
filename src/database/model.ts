import { PrismaClient, User } from "@prisma/client";
import { error } from "elysia";

export class DatabaseManager {
  connection: PrismaClient;
  constructor(connection: PrismaClient) {
    this.connection = connection;
  }

  public async create_user(user: CreateUserDTO) {
    return await this.connection.user.create({
      data: user,
    });
  }

  public async update_user(id: number, user: User) {
    return await this.connection.user.update({
      where: {
        id: id,
      },
      data: user,
    });
  }

  public async get_user_by_id(id: number) {
    return await this.connection.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        password: false,
      },
    });
  }

  public async get_all_user() {
    return await this.connection.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
  }

  public async get_current_profile(id: number) {
    console.error("WIP todo");
  }

  public async login_email_password(email: string, password: string) {
    return await this.connection.user.findFirst({
      where: {
        email: email,
      },
    });
  }
}
