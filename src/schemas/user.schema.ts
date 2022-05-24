import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  username: string;
  @Prop()
  passwordHash: string;
  @Prop()
  walletAddress: string;
  @Prop()
  mnemonic: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
