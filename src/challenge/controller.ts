import Elysia, { t } from "elysia";
import { ChallengeService } from "./service";
import jwt from "@elysiajs/jwt";
import { apiMiddleware } from "../auth/middleware/authMiddleware";

/**
 * TODO:
 * - [ ✓ ] Create Challenge
 * - [ ✓ ] Get Challenge
 * - [ ✓ ] Get Challenges owned by the User
 * - [   ] Get All Challenges of User
 * - [ ✓ ] Get Challenge by Id
 * - [ ~ ] Invite to Challenge
 * - [   ] Delete Challenge
 */

export class ChallengeController {
  service: ChallengeService;
  constructor(service: ChallengeService) {
    this.service = service;
  }

  public challengeController = new Elysia()
    .use(
      jwt({
        name: "userToken",
        secret: Bun.env.JWT_SECRET ?? "",
      })
    )
    .derive(
      async ({
        headers,
        userToken,
      }: {
        headers: Record<string, string | undefined>;
        userToken: any;
      }) => {
        const bearer = headers.authorization?.split(" ")[1];
        const token = await userToken.verify(bearer);
        return {
          userId: token.userId,
          email: token.email,
        };
      }
    )
    .get(
      "/challenge",
      ({ userId }) => {
        return this.service.get_all_challenges_of_user(userId);
      },
      { beforeHandle: apiMiddleware }
    )
    .get(
      "/challenge/:challenge_id",
      ({ params: { challenge_id } }) => {
        return this.service.get_challenge_by_id(challenge_id);
      },
      {
        beforeHandle: apiMiddleware,
        params: t.Object({
          challenge_id: t.Number(),
        }),
      }
    )
    .post(
      "/challenge/new",
      ({ userId, body }) => {
        return this.service.create_challenge(userId, body);
      },
      {
        beforeHandle: apiMiddleware,
        body: t.Object({
          name: t.String(),
          goal: t.String(),
        }),
      }
    )
    .post(
      "/challenge/:challengeId/invite",
      ({ userId, body, params: { challengeId } }) => {
        return this.service.invite_to_challenge(challengeId, userId, body);
      },
      {
        beforeHandle: apiMiddleware,
        body: t.Array(t.Number()),
        params: t.Object({
          challengeId: t.Numeric(),
        }),
      }
    )
    .put(
      "/challenge",
      (userToken) => {
        console.log("WIP Update Challenge");
      },
      {
        beforeHandle: apiMiddleware,
      }
    )
    .delete(
      "/challenge/:challenge_id",
      (userToken) => {
        console.log("WIP Delete Challenge by id");
      },
      {
        beforeHandle: apiMiddleware,
      }
    );
}
