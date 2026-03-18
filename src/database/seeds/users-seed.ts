import { DataSource } from 'typeorm';
import { hashPassword } from '@common/utils/password.util';
import { PersonEntity } from '@features/persons/entities/person.entity';
import { RoleEntity } from '@features/roles/entities/role.entity';
import { UserEntity, UserStatus } from '@features/users/entities/user.entity';
import { DocumentType, Gender, MaterialStatus } from '@features/persons/enums/person.enum';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';
import { TeacherEntity } from '@features/teachers/entities/teacher.entity';
import { StudentEntity } from '@features/students/entities/student.entity';
import { ContractType, EmployementStatus, LaborRegime, WorkloadType } from '@features/teachers/enums/teacher.enum';
import { StudentStatus, StudentType } from '@features/students/enums/student.enum';

export async function seedUsers(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(RoleEntity);
  const userRepo = dataSource.getRepository(UserEntity);
  const personRepo = dataSource.getRepository(PersonEntity);
  const teacherRepo = dataSource.getRepository(TeacherEntity);
  const studentRepo = dataSource.getRepository(StudentEntity);
  const institutionRepo = dataSource.getRepository(InstitutionEntity);

  const institution = await institutionRepo.findOne({ where: { name: 'Colegio Carmelinas' } });
  if (!institution) {
    console.error('❌ No se encontró la institución "Colegio Carmelinas". Asegúrate de que el seed de la institución corra primero.');
    return;
  }

  const roles = await roleRepo.find();
  const roleByName = (name: string) => roles.find((r) => r.name === name);

  const usersSeed = [
    {
      username: 'superadmin',
      email: 'superadmin@demo.local',
      password: 'SuperAdmin2026!',
      firstName: 'Super',
      lastName: 'Admin',
      roleName: 'Super Admin',
    },
    {
      username: 'admin',
      email: 'admin@demo.local',
      password: 'Admin2026!',
      firstName: 'Admin',
      lastName: 'Demo',
      roleName: 'Admin',
    },
    {
      username: 'director',
      email: 'director@carmelinas.edu.pe',
      password: 'Director2026!',
      firstName: 'Juan',
      lastName: 'Pérez',
      roleName: 'Director',
    },
    {
      username: 'docente',
      email: 'docente@carmelinas.edu.pe',
      password: 'Docente2026!',
      firstName: 'Maria',
      lastName: 'García',
      roleName: 'Docente',
    },
    {
      username: 'estudiante',
      email: 'estudiante@carmelinas.edu.pe',
      password: 'Estudiante2026!',
      firstName: 'Luis',
      lastName: 'Quispe',
      roleName: 'Estudiante',
    },
  ];

  let created = 0;

  for (const seed of usersSeed) {
    const existing = await userRepo.findOne({ where: { username: seed.username } });
    if (existing) continue;

    const role = roleByName(seed.roleName);
    if (!role) {
      console.warn(`⚠️ Rol no encontrado para ${seed.username}: ${seed.roleName}`);
      continue;
    }

    const person = await personRepo.save(
      personRepo.create({
        documentType: DocumentType.DNI,
        firstName: seed.firstName,
        lastName: seed.lastName,
        birthDate: new Date('1990-01-01'),
        gender: Gender.OTHER,
        birthPlace: 'Lima',
        nationality: 'Peruana',
        address: 'Calle Demo 123',
        district: 'Lima',
        province: 'Lima',
        department: 'Lima',
        phone: '015000000',
        mobile: '999000000',
        email: seed.email,
        photoUrl: '',
        materialStatus: MaterialStatus.SINGLE,
      }),
    );

    const user = userRepo.create({
      username: seed.username,
      email: seed.email,
      password: await hashPassword(seed.password),
      isActive: true,
      status: UserStatus.ACTIVE,
      person,
      role,
    });

    await userRepo.save(user);

    // Crear Entidad específica según el rol
    if (seed.roleName === 'Docente' || seed.roleName === 'Director') {
      const teacher = teacherRepo.create({
        teacherCode: `T-${seed.username.toUpperCase()}`,
        specialization: seed.roleName === 'Director' ? 'Gestión Educativa' : 'General',
        professionalTitle: 'Licenciado',
        university: 'UNMSM',
        graduationYear: 2015,
        professionalLicense: `LIC-${seed.username.toUpperCase()}`,
        contractType: ContractType.FULL_TIME,
        laborRegime: LaborRegime.PUBLIC,
        hireDate: new Date(),
        workloadType: WorkloadType.HOURS_40,
        weeklyHours: 40,
        teachingLevel: 'Secundaria',
        employmentStatus: EmployementStatus.ACTIVE,
        institution,
        person,
      });
      await teacherRepo.save(teacher);
      console.log(`✅ Registro de Docente creado para: ${seed.username}`);
    } else if (seed.roleName === 'Estudiante') {
      const student = studentRepo.create({
        studentCode: `S-${seed.username.toUpperCase()}`,
        studentType: StudentType.REGULAR,
        religion: 'Católica',
        nativeLanguage: 'Español',
        hasDisability: false,
        healthIssues: [],
        insunranceNumber: 'SIS-001',
        bloodType: 'O+',
        allergies: 'Ninguna',
        medicalConditions: 'Ninguna',
        admisionDate: new Date(),
        withdrawalReason: '',
        status: StudentStatus.ACTIVE,
        institution,
        person,
      });
      await studentRepo.save(student);
      console.log(`✅ Registro de Estudiante creado para: ${seed.username}`);
    }

    created += 1;
  }

  console.log(`✅ Seed de usuarios y perfiles completado (${created} nuevos)`);
}
