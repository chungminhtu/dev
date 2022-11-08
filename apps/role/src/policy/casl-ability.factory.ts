import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';

// CORE
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';
import { LoggingService } from '@core/logging';

// SHARED
import { User } from '@shared/entities/user/user.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// export type AppAbility = Ability<[Action, Subjects]>;

// /**
//  * @example
//  # article.service.ts
//  import { Action, CaslAbilityFactory } from '@/base/role/policy';
//
//  constructor(private readonly caslAbilityFactory: CaslAbilityFactory) {
//     this.caslForUser = this.caslAbilityFactory.createForUser;
//  }
//
//  retrieve(id: number, user: User) {
//    const article = await this.findOne(id)
//    const ability = this.caslForUser(user);
//    !ability.can(Action.Read, article) && this.caslAbilityFactory.throwForbidden();
//  }
//
//  * @example 2
//  # article.controller.ts
//  import { Action, CaslAbilityFactory } from '@/base/role/policy';
//
//  constructor(
//    private readonly service: SettingService,
//    private readonly caslAbilityFactory: CaslAbilityFactory,
//  ) {}
//
//  @Get(':key')
//  async retrieve(@Param('key') key: string, @Req() req: RequestUser) {
//     const ability = this.caslAbilityFactory.createForUser(req.user);
//     !ability.can(Action.Read, new Setting({ settingKey: key })) && this.caslAbilityFactory.throwForbidden();
//     return this.service.get(key, 'null');
//   }
//  */
export class CaslAbilityFactory {
  readonly logger = new LoggingService().getLogger(CaslAbilityFactory.name);

  createForUser(user: User, entity?: any) {
    // const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);
    // if (user && user.id === 1) {
    // can(Action.Manage, entity, 'all');
  }
  // if (user.company) {
  //   // Company
  //   can(Action.Update, Company, { id: user.company });
  //   can(Action.Read, Company, { id: user.company });
  //   can(Action.Create, Company, { id: user.company });
  //   can(Action.Delete, Company, { id: user.company });
  //
  //   // Orders
  //   // can(Action.Update, Orders, { companyId: user.company });
  //   // can(Action.Read, Orders, { companyId: user.company });
  //   // can(Action.Create, Orders, { companyId: user.company });
  //   // can(Action.Delete, Orders, { companyId: user.company });
  // }

  //   if (user.branchId) {
  //     // Branch
  //     can(Action.Update, Branch, { id: user.branchId });
  //     can(Action.Read, Branch, { id: user.branchId });
  //     can(Action.Create, Branch, { id: user.branchId });
  //     can(Action.Delete, Branch, { id: user.branchId });
  //   }
  //
  //   if (user.departmentId) {
  //     // Department
  //     can(Action.Update, Department, { id: user.departmentId });
  //     can(Action.Read, Department, { id: user.departmentId });
  //     can(Action.Create, Department, { id: user.departmentId });
  //     can(Action.Delete, Department, { id: user.departmentId });
  //   }
  //
  //   if (user.positionId) {
  //     // Position
  //     can(Action.Update, Position, { id: user.positionId });
  //     can(Action.Read, Position, { id: user.positionId });
  //     can(Action.Create, Position, { id: user.positionId });
  //     can(Action.Delete, Position, { id: user.positionId });
  //   }
  //
  //   return build({
  //     detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
  //   });
  // }

  // throwForbidden() {
  //   throw new RpcExc.BaseRpcException({
  //     errorCode: 'ABILITY011F',
  //     message: 'Không đủ quyền hạn để thực hiện hành động',
  //   });
  // }
}
