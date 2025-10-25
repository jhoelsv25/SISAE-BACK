export enum PeriodType {
  MONTHLY = 'monthly', //MES
  BIMONTHLY = 'bimonthly', //BIM
  QUARTERLY = 'quarterly', //TRI
  SEMESTER = 'semester', //SEM
  ANNUAL = 'annual', //ANO
}
export enum PeriodStatus {
  PLANNED = 'planned', //EN PLANIFICACION
  IN_PROGRESS = 'in_progress', //EN CURSO
  COMPLETED = 'completed', //COMPLETADO
  CANCELLED = 'cancelled', //CANCELADO
}

export enum TaskStatus {
  PENDING = 'pending', //PENDIENTE
  ONGOING = 'ongoing', //EN CURSO
  COMPLETED = 'completed', //COMPLETADO
  CANCELLED = 'cancelled', //CANCELADO
}

export enum DayOfWeek {
  SUNDAY = 'sunday', //DOMINGO
  MONDAY = 'monday', //LUNES
  TUESDAY = 'tuesday', //MARTES
  WEDNESDAY = 'wednesday', //MIERCOLES
  THURSDAY = 'thursday', //JUEVES
  FRIDAY = 'friday', //VIERNES
  SATURDAY = 'saturday', //SABADO
}

export enum ShiftType {
  MORNING = 'morning', //MAÑANA
  AFTERNOON = 'afternoon', //TARDE
  EVENING = 'evening', //NOCHE
  NIGHT = 'night', //NOCHE
}

export enum StatusType {
  ACTIVE = 'active', //ACTIVO
  INACTIVE = 'inactive', //INACTIVO
  PENDING = 'pending', //PENDIENTE
  SUSPENDED = 'suspended', //SUSPENDIDO
}

export enum GenderType {
  MALE = 'male', //MASCULINO
  FEMALE = 'female', //FEMENINO
  OTHER = 'other', //OTRO
}

export enum DocumentType {
  ID_CARD = 'id_card', //CÉDULA DE IDENTIDAD
  PASSPORT = 'passport', //PASAPORTE
  DRIVER_LICENSE = 'driver_license', //LICENCIA DE CONDUCIR
  BIRTH_CERTIFICATE = 'birth_certificate', //CERTIFICADO DE NACIMIENTO
  DNI = 'dni', //DOCUMENTO NACIONAL DE IDENTIDAD
  OTHER = 'other', //OTRO
}

export enum AttendanceStatus {
  PRESENT = 'present', //PRESENTE
  ABSENT = 'absent', //AUSENTE
  LATE = 'late', //TARDE
  EXCUSED = 'excused', //JUSTIFICADO
}

export enum EnrollmentStatus {
  ENROLLED = 'enrolled', //INSCRITO
  COMPLETED = 'completed', //COMPLETADO
  DROPPED = 'dropped', //RETIRADO
  GRADUATED = 'graduated', //GRADUADO
}

export enum PaymentStatus {
  PENDING = 'pending', //PENDIENTE
  COMPLETED = 'completed', //COMPLETADO
  FAILED = 'failed', //FALLIDO
  REFUNDED = 'refunded', //REEMBOLSADO
}

export enum NotificationType {
  EMAIL = 'email', //CORREO ELECTRÓNICO
  SMS = 'sms', //MENSAJE DE TEXTO
  PUSH = 'push', //NOTIFICACIÓN PUSH
}

export enum PriorityType {
  LOW = 'low', //BAJA
  MEDIUM = 'medium', //MEDIA
  HIGH = 'high', //ALTA
  URGENT = 'urgent', //URGENTE
}

export enum ResourceType {
  VIDEO = 'video', //VIDEO
  DOCUMENT = 'document', //DOCUMENTO
  AUDIO = 'audio', //AUDIO
  IMAGE = 'image', //IMAGEN
}

export enum AccessLevel {
  ADMIN = 'admin', //ADMINISTRADOR
  TEACHER = 'teacher', //PROFESOR
  STUDENT = 'student', //ESTUDIANTE
  GUEST = 'guest', //INVITADO
}

export enum LanguageType {
  ENGLISH = 'english', //INGLÉS
  SPANISH = 'spanish', //ESPAÑOL
  FRENCH = 'french', //FRANCÉS
  GERMAN = 'german', //ALEMÁN
  CHINESE = 'chinese', //CHINO
}

export enum FileType {
  PDF = 'pdf', //PDF
  DOCX = 'docx', //DOCX
  XLSX = 'xlsx', //XLSX
  PPTX = 'pptx', //PPTX
  JPG = 'jpg', //JPG
  PNG = 'png', //PNG
}

export enum ThemeType {
  LIGHT = 'light', //CLARO
  DARK = 'dark', //OSCuro
}

export enum WeekType {
  FIRST = 'first', //PRIMERO
  SECOND = 'second', //SEGUNDO
  THIRD = 'third', //TERCERO
  FOURTH = 'fourth', //CUARTO
}

export enum MonthType {
  JANUARY = 'january', //ENERO
  FEBRUARY = 'february', //FEBRERO
  MARCH = 'march', //MARZO
  APRIL = 'april', //ABRIL
  MAY = 'may', //MAYO
  JUNE = 'june', //JUNIO
  JULY = 'july', //JULIO
  AUGUST = 'august', //AGOSTO
  SEPTEMBER = 'september', //SEPTIEMBRE
  OCTOBER = 'october', //OCTUBRE
  NOVEMBER = 'november', //NOVIEMBRE
  DECEMBER = 'december', //DICIEMBRE
}

export enum AssessmentType {
  QUIZ = 'quiz', //CUESTIONARIO
  ASSIGNMENT = 'assignment', //TAREA
  EXAM = 'exam', //EXAMEN
  PROJECT = 'project', //PROYECTO
}

export enum SubmissionStatus {
  SUBMITTED = 'submitted', //ENTREGADO
  GRADED = 'graded', //CALIFICADO
  LATE = 'late', //TARDE
  MISSING = 'missing', //FALTANTE
}

export enum DiscussionStatus {
  OPEN = 'open', //ABIERTO
  CLOSED = 'closed', //CERRADO
  ARCHIVED = 'archived', //ARCHIVADO
}

export enum CollaborationRole {
  OWNER = 'owner', //PROPIETARIO
  EDITOR = 'editor', //EDITOR
  VIEWER = 'viewer', //VISOR
}
export enum CalendarEventType {
  HOLIDAY = 'holiday', //FESTIVO
  EXAM = 'exam', //EXAMEN
  ASSIGNMENT_DUE = 'assignment_due', //ENTREGA DE TAREA
  MEETING = 'meeting', //REUNIÓN
}

export enum CalendarEventStatus {
  SCHEDULED = 'scheduled', //PROGRAMADO
  COMPLETED = 'completed', //COMPLETADO
  CANCELLED = 'cancelled', //CANCELADO
}

export enum LessonStatus {
  SCHEDULED = 'scheduled', //PROGRAMADO
  ONGOING = 'ongoing', //EN CURSO
  COMPLETED = 'completed', //COMPLETADO
  CANCELLED = 'cancelled', //CANCELADO
}

export enum ResourceStatus {
  AVAILABLE = 'available', //DISPONIBLE
  UNAVAILABLE = 'unavailable', //NO DISPONIBLE
  ARCHIVED = 'archived', //ARCHIVADO
}

export enum ForumRole {
  ADMIN = 'admin', //ADMINISTRADOR
  MODERATOR = 'moderator', //MODERADOR
  MEMBER = 'member', //MIEMBRO
  GUEST = 'guest', //INVITADO
}

export enum MessageStatus {
  SENT = 'sent', //ENVIADO
  DELIVERED = 'delivered', //ENTREGADO
  READ = 'read', //LEÍDO
}

export enum ChatType {
  PRIVATE = 'private', //PRIVADO
  GROUP = 'group', //GRUPO
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum MaterialStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
}
