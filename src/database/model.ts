import { PrismaClient, User } from "@prisma/client";
import { error } from "elysia";
import { CreateChallengeDTO } from "../challenge/model";

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
        friendOf: true,
        friends: true,
        challenges: true,
        profile: true,
        sentFriendRequests: true,
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

  public async get_challenges_by_user(userId: number) {
    return await this.connection.challenge.findMany({
      where: {
        ownerId: userId,
      },
    });
  }

  public create_challenge(userId: number, challenge: CreateChallengeDTO) {
    return this.connection.challenge.create({
      data: {
        ownerId: userId,
        ...challenge,
      },
    });
  }

  public get_challenge_by_id(challengeId: number) {
    return this.connection.challenge.findFirst({
      where: {
        id: challengeId,
      },
    });
  }

  public invite_to_challenge(challengeId: number, userIds: number[]) {
    return this.connection.challenge.update({
      where: {
        id: challengeId,
      },
      data: {
        people: {
          createMany: {
            data: userIds.map((userId) => ({ userId })),
          },
        },
      },
    });
  }

  public get_friends_from_userid(userId: number) {
    return this.connection.user.findMany({
      where: {
        id: userId,
      },
      select: {
        friends: {
          select: {
            friend: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  public send_friend_request(userId: number, friendId: number) {
    return this.connection.friendRequest.create({
      data: {
        senderId: userId,
        receiverId: friendId,
      },
    });
  }

  public send_friends_request(userId: number, friendId: number[]) {
    return this.connection.friendRequest.createMany({
      data: friendId.map((friend) => ({
        senderId: userId,
        receiverId: friend,
      })),
    });
  }

  public get_friend_requests(userId: number) {
    return this.connection.friendRequest.findMany({
      where: {
        receiverId: userId,
      },
    });
  }

  public add_friends(userId: number, friendIds: number[]) {
    return this.connection.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          createMany: {
            data: friendIds.map((friendId) => ({ friendId })),
          },
        },
      },
    });
  }

  public async accept_friend_request(requestId: number) {
    const request = await this.connection.friendRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    await this.connection.user.update({
      where: {
        id: request.receiverId,
      },
      data: {
        friends: {
          create: {
            friendId: request.senderId,
          },
        },
      },
    });

    await this.connection.user.update({
      where: {
        id: request.senderId,
      },
      data: {
        friends: {
          create: {
            friendId: request.receiverId,
          },
        },
      },
    });

    return this.connection.friendRequest.delete({
      where: {
        id: requestId,
      },
    });
  }

  public get_friend_request(requestId: number) {
    return this.connection.friendRequest.findFirst({
      where: {
        id: requestId,
      },
    });
  }
}
