export interface ConfirmSubOrderRelease {
  customerOrders: Array<SubOrderReleaseCustomerOrder>;
  bidOfferPrice: number;
  bidDuration: number;
  maxSupplierViewOpportunity: number;
  vendors: Array<SubOrderReleaseVendor>;
}

interface SubOrderReleaseCustomerOrder {
  partId: number;
  priceAccepted: number;
}

interface SubOrderReleaseVendor {
  id: number;
  releasePriority: number;
  processProfileIds: Array<number>;
  postProcessProfileIds: Array<number>;
}


export interface ConfirmSubOrderReleaseResponse {
  bidOrderItemList: Array<BidOrderItem>;
  bidProcessItemList: Array<BidProcessItem>;
}

export interface BidOrderItem {
  id: number;
  quotePrice: number;
  partId: number;
  bidOrder: BidOrder;
}

interface BidProcessItem {
  id: number;
  bidOrderItem: BidOrderItem;
  processProfileIds: Array<number>;
  postProcessProfileIds: Array<number>;
  processPricingProfileIds: Array<number>;
  postPricingProfileIds: Array<number>;
  counterOfferPricingProfileId: number;
  counterOfferPostPricingProfileId: number;
  bidProcess: BidProcess;
}

interface BidProcess {
  id: number;
  vendorId: number;
  releasePriority: number;
  vendorBidStartAt: Date;
  bidProcessStatus: BidProcessStatusType;
  counterOfferPrice: number;
  bidOrder: BidOrder;
}

export interface BidProcessStatusType {
  id: number;
  name: string;
  description: string;
}

export interface BidOrderStatusType extends BidProcessStatusType {}

export interface BidOrder {
  id: number;
  bidStartAt: Date;
  bidDuration: number;
  currentBidRound: number;
  bidEndAt: Date;
  bidOfferPrice: number;
  bidOrderStatusType: BidOrderStatusType;
  winningBidProcessId: number;
}
