import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('experience')
      .select('id, company, role, description, start_date, end_date, current, location, sort_order')
      .order('sort_order', { ascending: true })
      .order('start_date', { ascending: false });

    if (error) {
      throw error;
    }

    return data?.map((experience) => this.mapExperience(experience)) ?? [];
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('experience')
      .select('id, company, role, description, start_date, end_date, current, location, sort_order')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Experience not found.');
    }

    return this.mapExperience(data);
  }

  async create(createExperienceDto: CreateExperienceDto) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('experience')
      .insert(this.toExperienceRow(createExperienceDto))
      .select('id, company, role, description, start_date, end_date, current, location, sort_order')
      .single();

    if (error) {
      throw error;
    }

    return this.mapExperience(data);
  }

  async update(id: string, updateExperienceDto: UpdateExperienceDto) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('experience')
      .update(this.toExperienceRow(updateExperienceDto))
      .eq('id', id)
      .select('id, company, role, description, start_date, end_date, current, location, sort_order')
      .single();

    if (error || !data) {
      throw new NotFoundException('Experience not found.');
    }

    return this.mapExperience(data);
  }

  async remove(id: string) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('experience')
      .delete()
      .eq('id', id)
      .select('id')
      .single();

    if (error || !data) {
      throw new NotFoundException('Experience not found.');
    }

    return {
      id: data.id,
      deleted: true,
    };
  }

  private toExperienceRow(experienceDto: CreateExperienceDto | UpdateExperienceDto) {
    return {
      ...(experienceDto.company !== undefined && { company: experienceDto.company }),
      ...(experienceDto.role !== undefined && { role: experienceDto.role }),
      ...(experienceDto.description !== undefined && { description: experienceDto.description }),
      ...(experienceDto.startDate !== undefined && { start_date: experienceDto.startDate || null }),
      ...(experienceDto.endDate !== undefined && { end_date: experienceDto.endDate || null }),
      ...(experienceDto.current !== undefined && { current: experienceDto.current }),
      ...(experienceDto.location !== undefined && { location: experienceDto.location }),
      ...(experienceDto.sortOrder !== undefined && { sort_order: experienceDto.sortOrder }),
    };
  }

  private mapExperience(experience: any) {
    return {
      id: experience.id,
      company: experience.company,
      role: experience.role,
      description: experience.description,
      startDate: experience.start_date,
      endDate: experience.end_date,
      current: experience.current,
      location: experience.location,
      sortOrder: experience.sort_order,
    };
  }
}
