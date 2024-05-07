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

  public invite_to_challenge(
    challenge: number,
    userId: number,
    users: number[]
  ) {
    // check if user owns the challenge
    return this.database.invite_to_challenge(challenge, users);
  }
}
