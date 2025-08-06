import { Exclude, Expose, Transform } from 'class-transformer';
import { Gender, BloodType, MaritalStatus } from '../entities/profile.entity';

export class ProfileResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  middleName?: string;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString().split('T')[0] : null))
  birthDate?: Date;

  @Expose()
  gender?: Gender;

  // Información de contacto (parcial por privacidad)
  @Expose()
  phoneNumber?: string;

  @Expose()
  city?: string;

  @Expose()
  state?: string;

  @Expose()
  country?: string;

  @Expose()
  nationality?: string;

  @Expose()
  bio?: string;

  @Expose()
  website?: string;

  @Expose()
  profileImage?: string;

  @Expose()
  occupation?: string;

  @Expose()
  preferredLanguage?: string;

  @Expose()
  isPublic: boolean;

  // Información sensible excluida por defecto
  @Exclude()
  documentNumber?: string;

  @Exclude()
  address?: string;

  @Exclude()
  alternativePhone?: string;

  @Exclude()
  workPhone?: string;

  @Exclude()
  bloodType?: BloodType;

  @Exclude()
  maritalStatus?: MaritalStatus;

  @Exclude()
  emergencyContactName?: string;

  @Exclude()
  emergencyContactPhone?: string;

  @Exclude()
  emergencyContactRelation?: string;

  @Exclude()
  medicalConditions?: string;

  @Exclude()
  allergies?: string;

  @Exclude()
  medications?: string;

  @Exclude()
  specialNeeds?: string;

  @Exclude()
  notes?: string;

  // Métodos computados
  @Expose()
  get fullName(): string {
    if (this.middleName) {
      return `${this.firstName} ${this.middleName} ${this.lastName}`;
    }
    return `${this.firstName} ${this.lastName}`;
  }

  @Expose()
  get age(): number | null {
    if (!this.birthDate) return null;

    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}

/**
 * DTO completo para usuarios autorizados (el propio usuario, admin, etc.)
 */
export class FullProfileResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  middleName?: string;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString().split('T')[0] : null))
  birthDate?: Date;

  @Expose()
  gender?: Gender;

  @Expose()
  documentNumber?: string;

  @Expose()
  documentType?: string;

  @Expose()
  phoneNumber?: string;

  @Expose()
  alternativePhone?: string;

  @Expose()
  address?: string;

  @Expose()
  city?: string;

  @Expose()
  state?: string;

  @Expose()
  postalCode?: string;

  @Expose()
  country?: string;

  @Expose()
  nationality?: string;

  @Expose()
  bloodType?: BloodType;

  @Expose()
  maritalStatus?: MaritalStatus;

  @Expose()
  occupation?: string;

  @Expose()
  workplace?: string;

  @Expose()
  workPhone?: string;

  @Expose()
  bio?: string;

  @Expose()
  website?: string;

  @Expose()
  profileImage?: string;

  @Expose()
  emergencyContactName?: string;

  @Expose()
  emergencyContactPhone?: string;

  @Expose()
  emergencyContactRelation?: string;

  @Expose()
  medicalConditions?: string;

  @Expose()
  allergies?: string;

  @Expose()
  medications?: string;

  @Expose()
  preferredLanguage?: string;

  @Expose()
  religion?: string;

  @Expose()
  specialNeeds?: string;

  @Expose()
  notes?: string;

  @Expose()
  isPublic: boolean;

  @Expose()
  allowNotifications: boolean;

  @Expose()
  allowSMS: boolean;

  @Expose()
  allowEmailNotifications: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Métodos computados
  @Expose()
  get fullName(): string {
    if (this.middleName) {
      return `${this.firstName} ${this.middleName} ${this.lastName}`;
    }
    return `${this.firstName} ${this.lastName}`;
  }

  @Expose()
  get age(): number | null {
    if (!this.birthDate) return null;

    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
