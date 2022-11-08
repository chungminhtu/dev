import { EOrdersState } from '@shared/enum/orders.enum';

export interface ISaleAdminChangeStatus {
  id: number;
  state?: EOrdersState;
  technicalExpertsId?: number;
  appointmentTime?: string;
}
