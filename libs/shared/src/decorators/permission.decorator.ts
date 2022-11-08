import { SetMetadata } from '@nestjs/common';

export const IS_PERMISSION_KEY = 'permission';
export const Permission = (permission: string) => SetMetadata(IS_PERMISSION_KEY, permission);
