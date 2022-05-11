import { IsEmail, IsNotEmpty, IsString, Length, Min } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;
  @IsString()
  @Length(5, 255, { message: 'the username provide is too short' })
  readonly username: string;
  @IsString()
  @Length(8)
  @IsNotEmpty()
  readonly password: string;
  @IsString()
  @Length(8)
  readonly retypePassword: string;
}
