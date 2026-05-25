import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperienceService } from './experience.service';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Public()
  @Get()
  findPublished() {
    return this.experienceService.findAll();
  }

  @Get('admin')
  findAllAdmin() {
    return this.experienceService.findAll();
  }

  @Get('admin/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.experienceService.findOne(id);
  }

  @Post()
  create(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experienceService.create(createExperienceDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateExperienceDto: UpdateExperienceDto) {
    return this.experienceService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experienceService.remove(id);
  }
}
