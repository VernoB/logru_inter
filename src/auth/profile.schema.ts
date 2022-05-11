import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { ObjectIdColumn } from 'typeorm';

export type ProfileDocument = Profile & Document;
@Schema()
export class Profile {
  @ObjectIdColumn()
  _id: ObjectId;

  @Prop()
  age: number;
}

export const profileSchema = SchemaFactory.createForClass(Profile);
