import Elysia, { t } from "elysia";
import { FriendService } from "./service";
import jwt from "@elysiajs/jwt";
import { apiMiddleware } from "../auth/middleware/authMiddleware";

/**
 // TODO Users
 * - [ ✓ ] Get user friends
 * - [ ✓ ] Get user friend request
 * - [ ✓ ] send friend requests
 * - [   ] Accept friend request
 * - [   ] Decline friend request
 */

export class FriendController {
  private service: FriendService;
  constructor(service: FriendService) {
    this.service = service;
  }

  public friendController = new Elysia()
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
      "/friends",
      ({ userId }) => {
        console.debug("🧑‍🤝‍🧑 Get all friends");
        return this.service.getFriends(userId);
      },
      {
        beforeHandle: apiMiddleware,
      }
    )
    .get(
      "/friends/pending",
      ({ userId }) => {
        console.debug("🧑‍🤝‍🧑 Get pending friend request");
        return this.service.getFriendRequest(userId);
      },
      {
        beforeHandle: apiMiddleware,
      }
    )
    .post(
      "/friends",
      ({ userId, body: { friendId } }) => {
        console.debug("🧑‍🤝‍🧑 Send friend request");
        return this.service.sendFriendRequest(userId, friendId);
      },
      {
        beforeHandle: apiMiddleware,
        body: t.Object({
          friendId: t.Number(),
        }),
      }
    )
    .post(
      "/friends/:id",
      ({ userId, params: { id }, body: { accept } }) => {
        console.debug("🧑‍🤝‍🧑 Accept/Decline friend request");
        return this.service.acceptFriendRequest(userId, id, accept);
      },
      {
        beforeHandle: apiMiddleware,
        params: t.Object({ id: t.Numeric() }),
        body: t.Object({
          accept: t.Boolean(),
        }),
      }
    );
}
