import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';

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
}
