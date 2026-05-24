import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { PortfolioService } from './portfolio.service';

@Public()
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('profile')
  getProfile() {
    return this.portfolioService.getProfile();
  }

  @Get('experience')
  getExperience() {
    return this.portfolioService.getExperience();
  }

  @Get('skills')
  getSkills() {
    return this.portfolioService.getSkills();
  }
}
