import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsOptional,
  IsEmail,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { ApplicationStatus } from '../schemas/application.schema';

export class PersonalInfoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  passportNumber: string;

  @IsDateString()
  @IsNotEmpty()
  passportExpirationDate: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

export class TravelInfoDto {
  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  purpose: string;

  @IsArray()
  @IsString({ each: true })
  travelCompanions: string[];

  @IsArray()
  @IsString({ each: true })
  travelDates: string[];

  @IsArray()
  @IsString({ each: true })
  travelDocuments: string[];

  @IsString()
  @IsNotEmpty()
  travelBudget: string;

  @IsString()
  @IsNotEmpty()
  travelInsurance: string;

  @IsDateString()
  @IsNotEmpty()
  intendedArrivalDate: string;

  @IsDateString()
  @IsNotEmpty()
  intendedDepartureDate: string;
}

export class CreateApplicationDto {
  @ValidateNested()
  @Type(() => PersonalInfoDto)
  personalInfo: PersonalInfoDto;

  @ValidateNested()
  @Type(() => TravelInfoDto)
  travelInfo: TravelInfoDto;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
