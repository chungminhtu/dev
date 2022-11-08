import { SetMetadata } from '@nestjs/common';

export const IS_POLICIES_KEY = 'policies';
export const CheckPolicies = (policies: boolean) => SetMetadata(IS_POLICIES_KEY, policies);
