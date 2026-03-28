import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { GlobalSearchDto } from './dto/global-search.dto';

@Injectable()
export class SearchService {
  constructor(private readonly dataSource: DataSource) {}

  async globalSearch(query: GlobalSearchDto, userId?: string, roleName?: string) {
    try {
      const result = await this.dataSource.query(`SELECT get_global_search($1) as result`, [
        JSON.stringify({
          search: query.search ?? '',
          limit: query.limit ?? 10,
          userId: userId ?? '',
          roleName: roleName ?? '',
        }),
      ]);

      return result?.[0]?.result ?? { data: [] };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }
}
