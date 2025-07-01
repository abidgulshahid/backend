import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema()
export class PersonalInfo {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passportNumber: string;

  @Prop({ required: true })
  passportExpirationDate: Date;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true })
  nationality: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  address: string;
}

@Schema()
export class TravelInfo {
  @Prop({ required: true })
  destination: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  purpose: string;

  @Prop({ type: [String], required: true })
  travelCompanions: string[];

  @Prop({ type: [String], required: true })
  travelDates: string[];

  @Prop({ type: [String], required: true })
  travelDocuments: string[];

  @Prop({ required: true })
  travelBudget: string;

  @Prop({ required: true })
  travelInsurance: string;

  @Prop({ required: true })
  intendedArrivalDate: Date;

  @Prop({ required: true })
  intendedDepartureDate: Date;
}

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: PersonalInfo, required: true })
  personalInfo: PersonalInfo;

  @Prop({ type: TravelInfo, required: true })
  travelInfo: TravelInfo;

  @Prop({ enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  @Prop()
  adminNotes?: string;
}

export const PersonalInfoSchema = SchemaFactory.createForClass(PersonalInfo);
export const TravelInfoSchema = SchemaFactory.createForClass(TravelInfo);
export const ApplicationSchema = SchemaFactory.createForClass(Application);
