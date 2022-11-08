import { Controller, Get } from '@nestjs/common';
import { StoryService } from '../services/story.service';

@Controller()
export class StoryController {
  constructor(private readonly storyService: StoryService) {}
  
  
  
  
}
