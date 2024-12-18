import { Elysia, t } from "elysia";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";

/**
 // TODO Auth
 * - [ ✓ ] Login
 * - [ ✓ ] Log out
 * - [ ✓ ] Register
 * - [ ✓ ] Middleware to check if user is logged in
 * - [   ] Verify Email
 * - [   ] Forgot Password
 * - [   ] Reset Password
 */

export class AuthController {
  service: AuthService;

  constructor(service: AuthService) {
    this.service = service;
  }

  public authController = new Elysia()
    .get("/auth", async () => { })
    .post(
      "/register",
      async ({ body }) => {
        console.debug("🔍 register");

        const newUser = body as CreateUserDTO;
        return this.service.register(newUser);
      },
      {
        body: t.Object({
          email: t.String({ format: "email" }),
          password: t.String(),
        }),
      }
    )
    .use(
      jwt({
        name: "userToken",
        secret: Bun.env.JWT_SECRET ?? "",
        exp: "7d",
      })
    )
    .post(
      "/login",
      async ({ userToken, body }) => {
        console.debug("🔍 login");
        return this.service.login(userToken, body.email, body.password);
      },
      {
        body: t.Object({
          email: t.String({ format: "email" }),
          password: t.String(),
        }),
      }
    )
    .use(
      jwt({
        name: "userToken",
        secret: Bun.env.JWT_SECRET ?? "",
      })
    )
    .get("logout", async ({ userToken, set, request }) => {
      const authHeader = request.headers.get("Authorization");
      const token = authHeader?.replace("Bearer ", "");

      const user = await userToken.verify(token);

      if (!user) {
        set.status = 401;
        return "Unauthorized";
      }
      return this.service.logout();
    });
}
