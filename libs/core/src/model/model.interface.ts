import { Payload } from '@core/api/api.schemas';

export interface INotFound<TData> extends Payload<TData> {
  doesThrow?: boolean;
}
