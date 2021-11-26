import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Type } from 'class-transformer';
import { SuperAppDocument, SuperAppSch } from 'src/schema/app.schema';

export type KeywordDocument = SuperAppDocument & Keyword;
export enum KeywordInfluence {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}
/**
 * Keywords document describes the phrases/keywords that user selected that will be used in
 *	@BalanceAction and used to recognize messages of the similiar (same) format in the future
 */
@Schema()
export class Keyword extends SuperAppSch {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: User;
}

export const KeywordSchema = SchemaFactory.createForClass(Keyword);
