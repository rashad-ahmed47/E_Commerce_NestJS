import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DBRepo } from './DB.repo';
import { IHUser, User } from '../../DB/schema/user.schema';

@Injectable()
export class UserRepo extends DBRepo<User> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super(userModel);
  }

  /**
   * Finds a user by their email address.
   * @param email - The email address to search for.
   * @returns The user document if found, otherwise null.
   */
  async findByEmail(email: string): Promise<IHUser | null> {
    return this.findOne({ email });
  }

  /**
   * Finds a user by their username.
   * @param username - The username to search for.
   * @returns The user document if found, otherwise null.
   */
  async findByUsername(username: string): Promise<IHUser | null> {
    return this.findOne({ username });
  }
}