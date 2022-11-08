import { Injectable } from '@nestjs/common';
import { BaseCrudService } from '@core/api/base-crud.service';
import { Category } from '@shared/entities/category/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggingService } from '@core/logging';
import { CategoryDto } from '@shared/dtos/category/category.dto';

@Injectable()
export class CategoryService extends BaseCrudService<Category> {
  constructor(
    @InjectRepository(Category)
    protected readonly repository: Repository<Category>,
    private readonly loggingService: LoggingService,
  ) {
    super(Category, repository, 'category', loggingService.getLogger(CategoryService.name));
  }

  async listCategory(query: CategoryDto) {
    return await this.listWithPageMono(query);
  }

  async getCategoryById(id: number) {
    return this.repository.findOne({ where: { id } });
  }
}
