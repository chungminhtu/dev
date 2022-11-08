import { enumProperty } from '@core/docs';

// Các trạng thái đơn
export enum EOrdersState {
  Deleted,
  Canceled,
  // Đơn mới
  InActive,
  // Đơn đã phân phối
  Active,
  // NVKD ko chấp nhận đơn
  NotAccept,
  // Sale admin nhận đơn
  Receive,
  // NVKD chấp nhận và thực hiện đơn
  Processing,
  // NVKD chuyển đơn về CSKH
  CustomerCare,
  // Đơn hoàn thành
  Done,
  // Chuyển cho sale admin
  TransferToSaleAdmin,
  // Đơn Affiliate tạo
  CreateByAffiliate,
}

// Trang thái chăm sóc đơn
export enum EOrdersStatus {
  // Chưa chăm sóc
  NotTakenCare,
  // Đã chăm sóc
  LookedAfter,
  // Chăm sóc không thành công
  CareFailed,
}

// Các loại đơn hàng
export enum EOrdersType {
  // Đơn hàng mới
  NewOrders,
  // Bảo hành
  Warranty,
  // Chăm sóc lại
  TakeCareAgain,
  // Đơn của PG
  PG,
  // Đơn của nút bấm
  Button,
  // Đơn của tiếp thị liên kết
  Affiliate,
}

export enum EOrdersSource {
  // Nguồn Affiliate
  AffiliateMarketing,
  // Nguồn Marketing
  TeleMarketing,
  // Nguồn Digital
  DigitalMarketing,
  // Nguồn Event
  EventMarketing,
}

export const stateProperty = enumProperty({
  enum: EOrdersSource,
  description: 'Orders state',
  example: EOrdersState.Active,
});

export const ordersSourceProperty = enumProperty({
  enum: EOrdersSource,
  description: 'Nguồn đơn hàng',
  example: EOrdersSource.TeleMarketing,
});

// Loại hình ảnh
export enum ImagesOrders {
  ProductImg,
  Invoice,
}
