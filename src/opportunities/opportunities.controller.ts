import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Post()
  findAndCreateOnBling() {
    return this.opportunitiesService.createOrderOnBling();
  }
}
