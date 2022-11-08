export interface ISearchResult {
  id: number;
  codeOrders?: string;
  phone?: string;
  companyName?: string;
  regionName?: string;
  branchName?: string;
  serviceName?: string;
  province?: string;
  district?: string;
  ward?: string;
  customerName?: string;
  consultantsName?: string;
  introducerName?: string;
  technicalExpertsName?: string;
  appointmentTime?: Date;
  startTime?: Date;
  endTime?: Date;
  session?: number;
  receiveApplicationTime?: Date;
  completionTime?: Date;
  state: number;
  createdAt?: Date;
}
