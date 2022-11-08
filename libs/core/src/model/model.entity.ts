import { BaseEntity as OrmBaseEntity } from 'typeorm/repository/BaseEntity';

export class BaseEntity extends OrmBaseEntity {
  constructor(partial: Record<string, any>) {
    super();
    Object.assign(this, partial);
    return this;
  }
}
