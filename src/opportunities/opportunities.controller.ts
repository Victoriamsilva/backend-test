import { Controller, Get, Post, Query } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { PaginationProps } from 'src/types/pagination';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Post()
  createOrderOnBling() {
    return this.opportunitiesService.createOrderOnBling();
  }

  @Get()
  findAll(
    @Query() paginationProps: PaginationProps,
    @Query('search') search: string,
    @Query('date') date: string,
  ) {
    return this.opportunitiesService.findPaginated(
      paginationProps,
      search,
      date,
    );
  }

  @Get('total')
  getTotal(@Query('date') date: string, @Query('search') search: string) {
    return this.opportunitiesService.getTotal(date, search);
  }
}
