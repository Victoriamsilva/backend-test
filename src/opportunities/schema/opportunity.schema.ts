import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from 'src/types/product';

@Schema({ typeKey: '$type' })
export class Opportunity {
  @Prop()
  orderId: number;

  @Prop()
  value: number;

  @Prop()
  date: Date;

  @Prop({
    type: {
      name: String,
      email: String,
    },
  })
  creator: {
    name: string;
    email?: string;
  };

  @Prop({
    type: {
      name: String,
      email: String,
      phone: String,
    },
  })
  contact?: {
    name: string;
    email?: string;
    phone?: string;
  };

  @Prop({
    type: {
      name: String,
    },
  })
  organization?: {
    name?: string;
  };

  @Prop()
  title?: string;

  @Prop()
  products?: Product[];
}

export const OpportunitySchema = SchemaFactory.createForClass(Opportunity);
