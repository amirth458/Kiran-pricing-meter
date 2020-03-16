export interface MetaData {
  id: number;
  name: string;
  description?: string;
}

export enum MetadataConfig {
  AUTO_PRICING_ELIGIBILITY = 'auto_pricing_eligibility',
  CUTOFF_FOR_MANUAL_PRICING = 'cutoff_for_manual_pricing',
  BID_RELEASE_CUTOFF_TYPE = 'bid_release_cutoff_type',
  BID_ORDER_STATUS_TYPE = 'bid_order_status_type',
  POST_PROCESS_ACTION = 'post_process_action',
  PAYMENT_STATUS_TYPE = 'payment_status_type',
  MEASUREMENT_UNIT_TYPE = 'measurement_unit_type'
}
