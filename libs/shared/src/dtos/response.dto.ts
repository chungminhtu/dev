export class ResponseDto<TData> {
  success: boolean;
  errorCode: string;
  data: TData;
  message: string;
  meta: any;

  constructor(data: TData, errorCode: string, success: boolean, message: string, meta: any) {
    this.success = success;
    this.errorCode = errorCode;
    this.data = data;
    this.message = message;
    this.meta = meta;
  }
}
