import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

// APPS

// CORE

// SHARED
import { Role } from '@shared/entities/role/role.entity';
import { Permission } from '@shared/entities/role/permission.entity';

const permissionFullAccess = Array.from(Array(99).keys());

const permissionSaleAdmin = [];

const permissionTechnicalStaff = [32, 34, 35, 42, 57, 60, 66, 67, 69, 49, 29, 70, 71, 9, 25, 12, 15];

const permissionCustomerCare = [
  12, 37, 38, 39, 40, 41, 7, 9, 11, 13, 15, 17, 42, 44, 49, 51, 54, 56, 57, 60, 61, 66, 67, 68, 69, 70, 71,
];

const permissionMarketing = [];

function generateData(roleName: string) {
  return {
    roleName: roleName,
    permissionGroup: null,
    createdAt: '2022-02-22 22:22:22.222222 +00:00',
    updatedAt: '2022-02-22 22:22:22.222222 +00:00',
  };
}

const superAdmin = generateData('SuperAdmin');

const saleAdmin = [generateData('Tele SaleAdmin'), generateData('Nhân viên SaleAdmin')];

const technicalStaff = generateData('Nhân viên kinh doanh');

const customerCare = generateData('Chăm sóc khách hàng');

const marketing = [generateData('Tele Marketing'), generateData('Nhân viên Marketing')];

@Injectable()
export class RoleSeed {
  constructor(
    @InjectRepository(Role)
    protected readonly repository: Repository<Role>,
    @InjectRepository(Permission)
    protected readonly repositoryPermission: Repository<Permission>,
  ) {}

  async seed() {
    const count = await this.repository.count();
    if (count) return;
    // Initialize roles
    superAdmin.permissionGroup = await this.repositoryPermission.findBy({ id: In(permissionFullAccess) });
    await this.repository.save(superAdmin);
    saleAdmin[0].permissionGroup = await this.repositoryPermission.findBy({ id: In(permissionSaleAdmin) });
    saleAdmin[1].permissionGroup = await this.repositoryPermission.findBy({ id: In(permissionSaleAdmin) });
    await this.repository.save(saleAdmin);
    technicalStaff.permissionGroup = await this.repositoryPermission.findBy({ id: In(permissionTechnicalStaff) });
    await this.repository.save(technicalStaff);
    customerCare.permissionGroup = await this.repositoryPermission.findBy({ id: In(permissionCustomerCare) });
    await this.repository.save(customerCare);
    marketing[0].permissionGroup = await this.repositoryPermission.findBy({ id: In(permissionMarketing) });
    marketing[1].permissionGroup = await this.repositoryPermission.findBy({ id: In(permissionMarketing) });
    await this.repository.save(marketing);
    return;
  }
}
