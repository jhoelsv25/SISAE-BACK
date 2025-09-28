import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
}

@Entity('profiles')
export class ProfileEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  middleName?: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  birthDate?: Date;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender?: Gender;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: true,
  })
  documentNumber?: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  documentType?: string; // DNI, Pasaporte, Cédula, etc.

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: true,
  })
  phoneNumber?: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  alternativePhone?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  address?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  city?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  state?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  postalCode?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  country?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  nationality?: string;

  @Column({
    type: 'enum',
    enum: BloodType,
    nullable: true,
  })
  bloodType?: BloodType;

  @Column({
    type: 'enum',
    enum: MaritalStatus,
    nullable: true,
  })
  maritalStatus?: MaritalStatus;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  occupation?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  workplace?: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  workPhone?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  website?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  profileImage?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  emergencyContactName?: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  emergencyContactPhone?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  emergencyContactRelation?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  medicalConditions?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  allergies?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  medications?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  preferredLanguage?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  religion?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  specialNeeds?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isPublic: boolean;

  @Column({
    type: 'boolean',
    default: true,
  })
  allowNotifications: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  allowSMS: boolean;

  @Column({
    type: 'boolean',
    default: true,
  })
  allowEmailNotifications: boolean;

  // Relación con usuario
  @Column({ type: 'uuid' })
  userId: string;

  @OneToOne(() => UserEntity, user => user.profile)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  // Métodos helper
  get fullName(): string {
    if (this.middleName) {
      return `${this.firstName} ${this.middleName} ${this.lastName}`;
    }
    return `${this.firstName} ${this.lastName}`;
  }

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

  get displayName(): string {
    return this.fullName;
  }

  get hasEmergencyContact(): boolean {
    return !!(this.emergencyContactName && this.emergencyContactPhone);
  }
}
