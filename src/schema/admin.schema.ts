import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  profilePicture?: string;

  @Prop({ required: true, default: 'admin' })
  role: string;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop()
  lastLogin?: Date;
}
export type AdminDocument = Admin & Document & { _id: string };
export const AdminSchema = SchemaFactory.createForClass(Admin);
