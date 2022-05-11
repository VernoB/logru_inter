import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDoc } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDoc>,
    private readonly jwtService: JwtService,
  ) {}
  private logger = new Logger(AuthService.name);

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public getTokenForUser(user: User): string {
    return this.jwtService.sign({
      username: user.username,
      sub: user._id,
    });
  }
}
