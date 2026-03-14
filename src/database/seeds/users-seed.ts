import { DataSource } from 'typeorm';
import { hashPassword } from '@common/utils/password.util';
import { PersonEntity } from '@features/persons/entities/person.entity';
import { RoleEntity } from '@features/roles/entities/role.entity';
import { UserEntity, UserStatus } from '@features/users/entities/user.entity';
import { DocumentType, Gender, MaterialStatus } from '@features/persons/enums/person.enum';

export async function seedUsers(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(RoleEntity);
  const userRepo = dataSource.getRepository(UserEntity);
  const personRepo = dataSource.getRepository(PersonEntity);

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
    created += 1;
  }

  console.log(`✅ Seed de usuarios completado (${created} nuevos)`);
}
