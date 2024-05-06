import { User } from "@prisma/client";
import { DatabaseManager } from "../database/model";

class UserService {
  database: DatabaseManager;
  constructor(database: DatabaseManager) {
    this.database = database;
  }

  /**
   * Create new user
   * @param user new user info
   * @returns new user
   */
  public create_user = async (user: CreateUserDTO) => {
    user.password = await Bun.password.hash(user.password);
    return this.database.create_user(user);
  };

  /**
   * returns all users
   * @returns all users
   */
  public get_all_users = async () => {
    return this.database.get_all_user();
  };

  /**
   * Return user from id
   * @param id user id
   * @returns
   */
  public get_user_by_id = async (id: number) => {
    return this.database.get_user_by_id(id);
  };
}

export default UserService;
