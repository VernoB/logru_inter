import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ where: { username } });

    if (!user) {
      this.logger.debug(`User ${user} Not Found!`);
      throw new UnauthorizedException();
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Password provided doesn't match with username`);
      throw new UnauthorizedException();
    }
    return user;
  }
}
