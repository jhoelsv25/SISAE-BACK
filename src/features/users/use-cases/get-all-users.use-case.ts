import { Injectable } from '@nestjs/common';
import { UserReadRepository } from '../repositories/user-read.repository';
import { UserQueryDto } from '../dto/user-query.dto';

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly readRepo: UserReadRepository) {}

  async execute(params: UserQueryDto) {
    let cursorDate: string | null = null;
    let cursorId: string | null = null;

    if (params.cursor) {
      try {
        const decoded = JSON.parse(Buffer.from(params.cursor, 'base64').toString('utf-8'));
        cursorDate = decoded.date;
        cursorId = decoded.id;
      } catch (e) {
        // invalid cursor, ignore
      }
    }

    const result = await this.readRepo.findAllCursor({
      limit: params.limit || params.size || 10,
      search: params.search,
      roleId: params.roleId,
      roleName: params.roleName,
      createdFrom: params.createdFrom,
      createdTo: params.createdTo,
      cursorDate,
      cursorId,
    });

    if (result.nextCursor) {
      result.nextCursor = Buffer.from(JSON.stringify(result.nextCursor)).toString('base64');
    }

    return result;
  }
}
