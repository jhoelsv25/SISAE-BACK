import { Injectable } from '@nestjs/common';
import { CacheService } from '../../../infrastruture/cache/cache.service';
import { ModuleReadRepository } from '../repositories/module-read.repository';

const CACHE_PREFIX = 'modules:id';
const CACHE_TTL = 300;

@Injectable()
export class GetModuleByIdUseCase {
  constructor(
    private readonly readRepo: ModuleReadRepository,
    private readonly cache: CacheService,
  ) {}

  async execute(id: string) {
    const cacheKey = `${CACHE_PREFIX}:${id}`;
    const cached = await this.cache.getJson<Awaited<ReturnType<ModuleReadRepository['findOne']>>>(cacheKey);
    if (cached != null) return cached;
    const result = await this.readRepo.findOne(id);
    if (result) await this.cache.setJson(cacheKey, result, CACHE_TTL);
    return result;
  }
}
