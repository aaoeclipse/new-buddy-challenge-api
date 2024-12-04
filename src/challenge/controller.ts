import Elysia, { t } from "elysia";
import { ChallengeService } from "./service";
import jwt from "@elysiajs/jwt";
import { apiMiddleware } from "../auth/middleware/authMiddleware";

/**
 // TODO Challenge:
 * - [ ✓ ] Create Challenge
 * - [ ✓ ] Get Challenges owned by the User
 * - [ ✓ ] Get All Challenges of User
 * - [ ✓ ] Get Latest Challenges of User
 * - [ ✓ ] Get Challenge by Id
 * - [   ] Delete Challenge
 * - [   ] Update Challenge
 * - [ ✓ ] Invite to Challenge
 * - [ ✓ ]      Invite to Challenge
 * - [ ✓ ]      Don't allow self invite
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
        console.debug("🥊 Get user challanges");
        return this.service.get_all_challenges_of_user(userId);
      },
      { beforeHandle: apiMiddleware }
    )
    .get("/challenge/latest",
      ({ userId }) => {
        console.debug("🥊 Get latest challenge by user");
        return this.service.get_latest_challenge_by_user(userId);
      },
      { beforeHandle: apiMiddleware }
    )
    .get(
      "/challenge/:challenge_id",
      ({ params: { challenge_id } }) => {
        console.debug("🥊 Get detailed challange by id");

        return this.service.get_challenge_by_id(challenge_id);
      },
      {
        beforeHandle: apiMiddleware,
        params: t.Object({
          challenge_id: t.Numeric(),
        }),
      }
    )
    .post(
      "/challenge/new",
      ({ userId, body }) => {
        console.debug("🥊 Create new challenge");
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
        console.debug("🥊 Invite people to challenge");
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
    .get(
      "/challenge/pending",
      ({ userId }) => {
        console.debug("🥊 Get pending challenges");
        return this.service.get_pending_challenges(userId);
      },
      {
        beforeHandle: apiMiddleware,
      }
    )
    .post(
      "/challenge/invite",
      ({ userId, body: { challengeId, accept } }) => {
        console.debug("🥊 Accept pending challenge");
        return this.service.accepted_challenge_invite(
          userId,
          challengeId,
          accept
        );
      },
      {
        beforeHandle: apiMiddleware,
        body: t.Object({
          challengeId: t.Numeric(),
          accept: t.Boolean(),
        }),
      }
    )
    .put(
      "/challenge",
      (userToken) => {
        console.debug("🥊 WIP change challenge");
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
