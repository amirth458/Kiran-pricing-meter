export interface ReportFilterOptions {
  page: number;
  size: number;
  sort: string;
  filters: {
    beginDate: string;
    endDate: string;
    searchValue: string;
    beginDateUpdated?: string;
    endDateUpdated?: string;
    lastAttemptDate: string;
  };
}
