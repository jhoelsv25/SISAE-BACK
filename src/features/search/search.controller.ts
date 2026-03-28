import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GlobalSearchDto } from './dto/global-search.dto';
import { SearchService } from './search.service';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('global')
  globalSearch(@Query() query: GlobalSearchDto, @Req() req: Request) {
    const user = (req as any).user ?? {};
    return this.searchService.globalSearch(query, user.id ?? user.sub, user.role);
  }
}
