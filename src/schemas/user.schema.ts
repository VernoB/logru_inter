import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Profile } from 'src/auth/profile.schema';
import { ObjectIdColumn } from 'typeorm';

export type UserDoc = User & Document;

@Schema()
export class User {
  @ObjectIdColumn()
  @Expose()
  _id: ObjectId;

  @Prop({ unique: true })
  @Expose()
  email: string;

  @Prop({ lowercase: true, unique: true })
  @Expose()
  username: string;

  @Prop({ select: false })
  @Exclude()
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  profile: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
