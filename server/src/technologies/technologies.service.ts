import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';

@Injectable()
export class TechnologiesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('technologies')
      .select('id, name, icon_url, category')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return (
      data?.map((technology) => ({
        id: technology.id,
        name: technology.name,
        iconClass: technology.icon_url,
        category: technology.category,
      })) ?? []
    );
  }

  async create(createTechnologyDto: CreateTechnologyDto) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('technologies')
      .insert({
        name: createTechnologyDto.name,
        icon_url: createTechnologyDto.iconClass,
        category: createTechnologyDto.category,
      })
      .select('id, name, icon_url, category')
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      iconClass: data.icon_url,
      category: data.category,
    };
  }

  async update(id: string, updateTechnologyDto: UpdateTechnologyDto) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('technologies')
      .update(this.toTechnologyRow(updateTechnologyDto))
      .eq('id', id)
      .select('id, name, icon_url, category')
      .single();

    if (error || !data) {
      throw new NotFoundException('Technology not found.');
    }

    return this.mapTechnology(data);
  }

  async remove(id: string) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('technologies')
      .delete()
      .eq('id', id)
      .select('id')
      .single();

    if (error || !data) {
      throw new NotFoundException('Technology not found.');
    }

    return {
      id: data.id,
      deleted: true,
    };
  }

  private toTechnologyRow(technologyDto: CreateTechnologyDto | UpdateTechnologyDto) {
    return {
      ...(technologyDto.name !== undefined && { name: technologyDto.name }),
      ...(technologyDto.iconClass !== undefined && { icon_url: technologyDto.iconClass }),
      ...(technologyDto.category !== undefined && { category: technologyDto.category }),
    };
  }

  private mapTechnology(technology: any) {
    return {
      id: technology.id,
      name: technology.name,
      iconClass: technology.icon_url,
      category: technology.category,
    };
  }
}
