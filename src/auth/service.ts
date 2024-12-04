import { DatabaseManager } from "../database/model";

export class AuthService {
  database: DatabaseManager;
  constructor(database: DatabaseManager) {
    this.database = database;
  }

  /**
   * Login user with email and password
   *
   * @param email user email
   * @param password user password
   * @returns user if login is successful
   */
  public login = async (tokenManager: any, email: string, password: string) => {
    const user = await this.database.login_email_password(email, password);
    if (!user) throw new Error("Wrong username or password");

    const isMatch = await Bun.password.verify(password, user.password);

    if (!isMatch) throw new Error("Wrong username or password");

    // Get the JWT secret from the .env file
    const token = await tokenManager.sign({
      userId: user.id,
      email: user.email,
    });

    return { token: token };
  };

  /**
   * Register new user
   * @param user email and password
   * @returns
   */
  public register = async (user: CreateUserDTO) => {
    user.password = await Bun.password.hash(user.password);
    return this.database.create_user(user);
  };

  /**
   * Loug out user
   */
  public logout = async () => {
    return "Logout";
    // return this.database.logout();
  };
}
