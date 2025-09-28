import { Injectable } from '@nestjs/common';
import { ErrorHandler } from '../../../common/exceptions';
import { RoleReadRepository } from '../repositories/role-read.repository';
import { RoleWriteRepository } from '../repositories/role-write.repository';

@Injectable()
export class RemoveRoleUseCase {
  constructor(
    private readonly writeRepo: RoleWriteRepository,
    private readonly readRepo: RoleReadRepository,
  ) {}

  async execute(id: string) {
    // Validar si existe
    const role = await this.readRepo.findOne(id);

    // Opcional: validar si hay usuarios asociados para evitar borrar
    if (role.users?.length > 0) throw new ErrorHandler('No se puede eliminar un rol con usuarios');

    return this.writeRepo.softDelete(id);
  }
}
