import { IsString, IsOptional, IsEnum, IsBoolean, Length } from 'class-validator';
import { Gender, BloodType, MaritalStatus } from '../entities/profile.entity';

/**
 * DTO para información personal básica
 */
export class BasicProfileDto {
  @IsString()
  @Length(1, 100)
  firstName: string;

  @IsString()
  @Length(1, 100)
  lastName: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  middleName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  profileImage?: string;
}

/**
 * DTO para información de contacto
 */
export class ContactInfoDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  alternativePhone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  state?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  postalCode?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  country?: string;
}

/**
 * DTO para información médica
 */
export class MedicalInfoDto {
  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType;

  @IsOptional()
  @IsString()
  medicalConditions?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  medications?: string;

  @IsOptional()
  @IsString()
  specialNeeds?: string;
}

/**
 * DTO para contacto de emergencia
 */
export class EmergencyContactDto {
  @IsString()
  @Length(1, 100)
  emergencyContactName: string;

  @IsString()
  @Length(1, 50)
  emergencyContactPhone: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  emergencyContactRelation?: string;
}

/**
 * DTO para configuraciones de privacidad
 */
export class PrivacySettingsDto {
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsBoolean()
  allowNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  allowSMS?: boolean;

  @IsOptional()
  @IsBoolean()
  allowEmailNotifications?: boolean;
}

/**
 * DTO para información profesional (docentes, personal)
 */
export class ProfessionalInfoDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  occupation?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  workplace?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  workPhone?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  website?: string;
}
