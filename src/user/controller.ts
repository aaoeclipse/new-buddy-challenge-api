import { Elysia, t } from "elysia";
import UserService from "./service";

/**
 // TODO Users
 * - [ ✓ ] Get Users
 * - [ ✓ ] Get User by id
 * - [ ✓ ] Create User
 * - [   ] Delete User
 * - [   ] Create profile to the user
 */

class UserController {
  service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }

  public userController = new Elysia()
    .get("/user", async () => {
      console.debug("🧙‍♂️ get all users");

      return this.service.get_all_users();
    })

    .get(
      "/user/:id",
      ({ params }) => {
        console.debug("🧙‍♂️ get user by id");

        const userId = params.id;
        // Logic to fetch a user by ID
        return this.service?.get_user_by_id(userId);
      },
      { params: t.Object({ id: t.Numeric() }) }
    )
    .post(
      "/user",
      async ({ body }) => {
        console.debug("🧙‍♂️ create user");

        const newUser: CreateUserDTO = body;
        return await this.service?.create_user(newUser);
      },
      {
        body: t.Object({
          email: t.String({ format: "email" }),
          password: t.String({
            minLength: 5,
            maxLength: 100,
            errorMessage: "Password must be more than 5 characters long",
          }),
        }),
      }
    )
    .delete(
      "/user/:id",
      ({ params }) => {
        console.debug("🧙‍♂️ delete user");

        const userId = params.id;
        // Logic to delete a user by ID
        return `Delete user with ID: ${userId}`;
      },
      {
        params: t.Object({
          id: t.Numeric(),
        }),
      }
    );
}

export default UserController;
