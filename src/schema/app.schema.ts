import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SuperAppSch {}

export type SuperAppDocument = SuperAppSch &
  Document & {
    id: string;
  };

export const SuperAppSchema = SchemaFactory.createForClass(SuperAppSch).set(
  'toObject',
  {
    virtuals: true,
  },
);
SuperAppSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

@Schema()
export class ChildSch extends SuperAppSch {}

export type ChildDocument = SuperAppDocument & ChildSch;
export const ChildSchema = SchemaFactory.createForClass(ChildSch);
