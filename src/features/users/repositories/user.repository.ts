import { EntityManager, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export class UserRepository extends Repository<User> {
  constructor(manager: EntityManager) {
    super(User, manager);
  }

  async findActiveUsers(): Promise<User[]> {
    return this.find({ where: { isActive: true } });
  }

  async findByRole(roleName: string): Promise<User[]> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('role.name = :roleName', { roleName })
      .getMany();
  }
}
