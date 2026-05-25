import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';

@Module({
  imports: [SupabaseModule],
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule {}
