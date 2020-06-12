export interface ConfirmSubOrderRelease {
  customerOrders: Array<SubOrderReleaseCustomerOrder>;
  bidOfferPrice: number;
  bidDuration: number;
  maxSupplierViewOpportunity: number;
  vendors: Array<SubOrderReleaseVendor>;
  originalPrice: number;
  startingReleasePricePercentile: number;
  priceIncrementPercentile: number;
  thresholdBidPricePercentile: number;
  timeIncrement: number;
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
export class MatchedProfile {
  id: string;
  vendorId: number;
  profileId: number;
  vendorName: string;
  processProfileName: string;
  facilityName: string;
  releasePriority: string | number;
  vendorProfile: {
    street1: string;
    street2: string;
    state: string;
    city: string;
    country: string | number;
    zipCode: string;
    subscriptionId: string | number;
    subscriptionType: string;
  };
  confidentialityId: number;
  active: boolean;
}

export interface BidVendorMatchingProfileDetails {
  vendorId: number;
  processProfieBidViews: Array<ProcessProfileBidView>;
  bidProcessStatusType: BidProcessStatusType;
}

export interface ProcessProfileBidView {
  processProfileId: number;
  processProfileName: string;
  vendorName: string;
  pricingProfileCount: string;
  facilityNames: Array<string>;
}
