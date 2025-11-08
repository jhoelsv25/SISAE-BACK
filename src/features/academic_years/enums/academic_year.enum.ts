export enum Modality {
  IN_PERSON = 'in-person',
  ONLINE = 'online',
  HYBRID = 'hybrid',
}

export enum GradingSystem {
  PERCENTAGE = 'percentage',
  LETTER = 'letter',
  GPA = 'gpa',
}

export enum AcademicYearStatus {
  PLANNED = 'planned',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type PeriodType = 'monthly' | 'bimonthly' | 'quarterly' | 'semester' | 'annual';
