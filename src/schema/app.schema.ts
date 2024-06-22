import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SuperAppSch {}

export type SuperAppDocument = SuperAppSch & Document & { id: string };

export const createVirtualSchema = (param: any) => {
  return SchemaFactory.createForClass(param)
    .set('timestamps', true)
    .set('toObject', {
      virtuals: true,
    })
    .set('toJSON', { virtuals: true });
};
export const SuperAppSchema = createVirtualSchema(SuperAppSch);
