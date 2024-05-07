import { FriendRequest, UserFriend } from "@prisma/client";
import { DatabaseManager } from "../database/model";

export class FriendService {
  private database: DatabaseManager;
  constructor(database: DatabaseManager) {
    this.database = database;
  }

  public async getFriends(userId: number) {
    const friends = await this.database.get_friends_from_userid(userId);
    // Extract the id and email fields from the friends array
    const formattedFriends = friends[0]?.friends.map((friendObj) => ({
      id: friendObj.friend.id,
      email: friendObj.friend.email,
    }));

    return formattedFriends || [];
  }

  public async sendFriendRequest(userId: number, friendId: number) {
    if (userId === friendId) throw new Error("You can't add yourself");
    const [friendExists, userAlreadyFriend] = await Promise.all([
      this.database.get_user_by_id(friendId),
      this.database.get_user_by_id(userId),
    ]);

    if (!friendExists) throw new Error("Friend not found");
    if (!userAlreadyFriend) throw new Error("User not found");
    if (
      userAlreadyFriend.friends.some(
        (f: UserFriend) => f.friendId === friendId
      ) ||
      userAlreadyFriend.sentFriendRequests.some(
        (f: FriendRequest) => f.receiverId === friendId
      )
    ) {
      throw new Error("Already Friends!");
    }
    const friend = await this.database.send_friend_request(userId, friendId);
    return friend;
  }

  public async getFriendRequest(userId: number) {
    const friendRequest = await this.database.get_friend_requests(userId);
    return friendRequest;
  }

  public async acceptFriendRequest(
    userId: number,
    requestId: number,
    accept: boolean
  ) {
    const request = await this.database.get_friend_request(requestId);
    if (!request) {
      console.info("⚠️ No request found");
      throw new Error("Invalid request");
    }
    if (request.receiverId !== userId) {
      console.info("⚠️ User trying to accept a request that is not his");
      throw new Error("Invalid request");
    }
    const friend = await this.database.accept_friend_request(requestId);
    return friend;
  }
}
