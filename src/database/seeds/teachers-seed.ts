import { DataSource } from 'typeorm';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';
import { PersonEntity } from '@features/persons/entities/person.entity';
import { TeacherEntity } from '@features/teachers/entities/teacher.entity';
import { DocumentType, Gender, MaterialStatus } from '@features/persons/enums/person.enum';
import {
  ContractType,
  EmployementStatus,
  LaborRegime,
  WorkloadType,
} from '@features/teachers/enums/teacher.enum';

export async function seedTeachers(dataSource: DataSource) {
  const institutionRepo = dataSource.getRepository(InstitutionEntity);
  const personRepo = dataSource.getRepository(PersonEntity);
  const teacherRepo = dataSource.getRepository(TeacherEntity);

  let institution = await institutionRepo.findOne({ where: { modularCode: 'M0001' } });
  if (!institution) {
    institution = institutionRepo.create({
      name: 'Institución Demo',
      modularCode: 'M0001',
      managementType: 'Pública',
      ugel: 'UGEL 01',
      dre: 'DRE Lima',
      principal: 'Dirección Demo',
      address: 'Av. Principal 123',
      district: 'Lima',
      province: 'Lima',
      department: 'Lima',
      phone: '015000000',
      email: 'institucion@demo.local',
      status: 'ACTIVE',
      logoUrl: '',
      description: 'Institución creada para seeds',
    });
    institution = await institutionRepo.save(institution);
    console.log('✅ Institución creada para seed de docentes');
  }

  let created = 0;

  for (let i = 1; i <= 10; i += 1) {
    const teacherCode = `T2026${String(i).padStart(4, '0')}`;
    const existingTeacher = await teacherRepo.findOne({ where: { teacherCode } });
    if (existingTeacher) {
      continue;
    }

    const person = personRepo.create({
      documentType: DocumentType.DNI,
      firstName: `Docente${i}`,
      lastName: `Demo${i}`,
      birthDate: new Date(`198${i % 10}-01-01`),
      gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
      birthPlace: `Nacimiento ${i}`,
      nationality: 'Peruana',
      address: `Calle Falsa ${i}`,
      district: `Distrito ${i}`,
      province: `Provincia ${i}`,
      department: `Departamento ${i}`,
      phone: `0150000${String(i).padStart(2, '0')}`,
      mobile: `9990000${String(i).padStart(2, '0')}`,
      email: `docente${i}@demo.local`,
      photoUrl: '',
      materialStatus: MaterialStatus.SINGLE,
    });

    const savedPerson = await personRepo.save(person);

    const teacher = teacherRepo.create({
      teacherCode,
      specialization: 'Matemática',
      professionalTitle: 'Licenciado en Educación',
      university: 'UNMSM',
      graduationYear: 2010 + i,
      professionalLicense: `COL-${String(i).padStart(4, '0')}`,
      contractType: ContractType.FULL_TIME,
      laborRegime: LaborRegime.PUBLIC,
      hireDate: new Date('2020-03-01'),
      terminationDate: null,
      workloadType: WorkloadType.HOURS_40,
      weeklyHours: 40,
      teachingLevel: 'Secundaria',
      employmentStatus: EmployementStatus.ACTIVE,
      institution,
      person: savedPerson,
    });

    await teacherRepo.save(teacher);
    created += 1;
  }

  console.log(`✅ Seed de docentes completado (${created} nuevos)`);
}
