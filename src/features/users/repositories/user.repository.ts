import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

export class UserRepository extends Repository<UserEntity> {
  constructor(manager: EntityManager) {
    super(UserEntity, manager);
  }

  async findActiveUsers(): Promise<UserEntity[]> {
    return this.find({ where: { isActive: true } });
  }

  async findByRole(roleName: string): Promise<UserEntity[]> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('role.name = :roleName', { roleName })
      .getMany();
  }
}
