import { Injectable } from '@nestjs/common';
import { CacheService } from '../../../infrastruture/cache/cache.service';
import { FilterModuleDto } from '../dto/filter-module.dto';
import { ModuleReadRepository } from '../repositories/module-read.repository';

const CACHE_PREFIX = 'modules:list';
const CACHE_TTL = 300; // 5 min

@Injectable()
export class GetModulesUseCase {
  constructor(
    private readonly readRepo: ModuleReadRepository,
    private readonly cache: CacheService,
  ) {}

  async execute(filters?: FilterModuleDto) {
    const cacheKey = filters ? `${CACHE_PREFIX}:${JSON.stringify(filters)}` : CACHE_PREFIX;
    const cached = await this.cache.getJson<Awaited<ReturnType<ModuleReadRepository['findAll']>>>(cacheKey);
    if (cached != null) return cached;
    const result = await this.readRepo.findAll(filters);
    await this.cache.setJson(cacheKey, result, CACHE_TTL);
    return result;
  }
}
