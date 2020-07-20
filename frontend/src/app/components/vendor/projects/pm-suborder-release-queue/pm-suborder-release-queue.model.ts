/*
 PM- Suborder release queue table headers
 */

export interface SuborderReleaseQueue {
  partId: number;
  rfqId: number;
  orderId: number;
  customerName: string;
  sameVendor: boolean;
  totalRowCount: number;
  bidProjectStatus: string;
  projectType?: string;
}

export class SearchOpt {
  projectTypeId: number;
  beginDate: Date;
  endDate: Date;
  searchValue: string;
  partStatusIds: number;
  showTestAccount: boolean;
  constructor() {
    this.projectTypeId = null;
    this.beginDate = null;
    this.endDate = null;
    this.searchValue = null;
    this.partStatusIds = null;
    this.showTestAccount = false;
  }
}
