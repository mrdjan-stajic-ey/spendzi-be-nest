import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SuperAppDocument, SuperAppSch } from 'src/schema/app.schema';

@Schema()
export class User extends SuperAppSch {
  @Prop()
  username: string;
  @Prop()
  email: string;
  @Prop()
  isAdmin: boolean;
  @Prop()
  password: string;
}

export type UserDocument = User & SuperAppDocument;

export const UserSchema = SchemaFactory.createForClass(User).set('toObject', {
  virtuals: true,
});
