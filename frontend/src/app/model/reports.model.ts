export class Reports {
  reportId: number;
  orderId: number;
  status: string;
  totalRowCount: number;
  customerName: string;
  reportRequested: number;
}

export enum ReportStatus {
  ANALYSIS_COMPLETE = 3
}
