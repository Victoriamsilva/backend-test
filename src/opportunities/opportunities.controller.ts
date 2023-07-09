import { Controller, Get, Param, Post, Query } from '@nestjs/common';
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
  findAll(@Query() paginationProps: PaginationProps) {
    return this.opportunitiesService.findPaginated(paginationProps);
  }
}
