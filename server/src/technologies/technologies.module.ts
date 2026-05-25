import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { TechnologiesController } from './technologies.controller';
import { TechnologiesService } from './technologies.service';

@Module({
  imports: [SupabaseModule],
  controllers: [TechnologiesController],
  providers: [TechnologiesService],
})
export class TechnologiesModule {}
