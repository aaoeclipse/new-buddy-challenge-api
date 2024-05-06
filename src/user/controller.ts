import { Elysia, t } from "elysia";
import UserService from "./service";

class UserController {
  service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }

  public userController = new Elysia()
    .get("/user", async () => {
      return this.service.get_all_users();
    })

    .get(
      "/user/:id",
      ({ params }) => {
        const userId = params.id;
        // Logic to fetch a user by ID
        return this.service?.get_user_by_id(userId);
      },
      { params: t.Object({ id: t.Numeric() }) }
    )
    .post(
      "/user",
      async ({ body }) => {
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
        const userId = params.id;
        // Logic to delete a user by ID
        return `Delete user with ID: ${userId}`;
      },
      {
        params: t.Object({
          id: t.Numeric(),
        }),
      }
    )
    .post("/friend", async ({ body }: { body: any }) => {
      return body;
    });
}

export default UserController;
