import { enumProperty } from '@core/docs';

export enum EState {
  InActive,
  Active,
  Deleted,
}

export enum EProductType {
  Normal,
  Warranty,
}

export enum EStateCampaign {
  InActive,
  // Dang hoat dong
  Active,
  Deleted,
  // Tam dung
  Pending,
  // Hoan Thanh
  Done,
}

export const stateProperty = enumProperty({
  enum: EState,
  description: 'status',
  example: EState.Active,
});

export enum ESyncManagerCompany {
  Company = 'company',
}
