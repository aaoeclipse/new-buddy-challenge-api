import { Challenge, User } from "@prisma/client";
import { DatabaseManager } from "../database/model";
import { CreateChallengeDTO } from "./model";

export class ChallengeService {
  database: DatabaseManager;
  constructor(database: DatabaseManager) {
    this.database = database;
  }

  public create_challenge(userId: number, challenge: CreateChallengeDTO) {
    return this.database.create_challenge(userId, challenge);
  }

  public get_all_challenges_of_user(user: number) {
    return this.database.get_challenges_by_user(user);
  }

  public get_challenge_by_id(challengeId: number) {
    return this.database.get_challenge_by_id(challengeId);
  }

  public get_latest_challenge_by_user(userId: number) {
    return this.database.get_latest_challenge_by_user(userId);
  }

  public invite_to_challenge(
    challenge: number,
    userId: number,
    users: number[]
  ) {
    if (users.includes(userId)) {
      throw new Error("User cannot invite himself");
    }
    // TODO: check if user owns the challenge
    return this.database.invite_to_challenge(challenge, users);
  }

  public get_pending_challenges(userId: number) {
    return this.database.get_pending_challenges(userId);
  }

  public accepted_challenge_invite(
    userId: number,
    challengeId: number,
    accept: boolean
  ) {
    return this.database.accept_challenge(userId, challengeId, accept);
  }

}

