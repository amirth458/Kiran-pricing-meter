export interface PlanCode {
  id: number;
  planCode: string;
  planLink: string;
}

export interface ProductType {
  id: number;
  name: string;
}

export interface SubscriptionType {
  id: number;
  name: string;
  planCode: PlanCode;
  cost: number;
  productType: ProductType;
}

export interface Addon {
  id: number;
  name: string;
  planCode: PlanCode;
  cost: number;
  productType: ProductType;
}

export class Contract {
  id: number;
  addOnsIds: number[];
  SubscriptionType: SubscriptionType;
}

export enum SubscriptionTypeEnum {
  SHOPSIGHT_FREE = 'SHOPSIGHT_FREE',
  SHOPSIGHT_PRE_PRODUCTION = 'SHOPSIGHT_PRE_PRODUCTION',
  SHOPSIGHT_PRODUCTION = 'SHOPSIGHT_PRODUCTION',
  SHOPSIGHT_360_PLUS = 'SHOPSIGHT_360_PLUS',
  SHOPSIGHT_DESIGN_FREE = 'SHOPSIGHT_DESIGN_FREE',
  SHOPSIGHT_DESIGN_360 = 'SHOPSIGHT_DESIGN_360',
  SHOPSIGHT_360 = 'SHOPSIGHT_360'
}

export enum SubscriptionTypeIdEnum {
  SHOPSIGHT_FREE = 1,
  SHOPSIGHT_PRE_PRODUCTION = 2,
  SHOPSIGHT_PRODUCTION = 3,
  SHOPSIGHT_360_PLUS = 4,
  SHOPSIGHT_DESIGN_FREE = 5,
  SHOPSIGHT_DESIGN_360 = 6,
  SHOPSIGHT_360 = 7
}

export enum FeatureTypeIdEnum {
  CREATION_OF_FACILITY_MACHINE_PROCESS_AND_PRICING_PROFILES = 30, // Done
  ACCESS_TO_PRODEX_JOB_OPPORTUNITIES = 31, // From Admin Side
  PRODEX_ORDER_MANAGEMENT = 32, // From Admin Side
  UPLOAD_YOUR_OWN_ORDERS = 33, // Done - This Also Controls suborder
  PROCESS_SELECTOR_TOOL = 34, // Done
  PRICING_ESTIMATOR_TOOL = 35, // Done
  JOB_CREATION_AND_MANAGEMENT = 36, // Done
  TASK_LIST_GENERATOR = 37, // Done - Add Task
  JOB_ROUTERS_TRAVELERS = 38, // Done - Save Router Template
  SHOP_FLOOR_VISIBILITY_TOOL = 39, // Not Availible
  AUTOMATED_JOB_TRACKING_LOGS = 40, // Not Availible
  AUDIT_REPORTS = 41, // Not Availible
  ZOOM_VIDEO_INTEGRATION_FOR_CUSTOMER_ENGAGEMENT = 42,
  ACCESS_TO_PRODEX_CONNECT_PRODUCTION_OPPORTUNITIES = 43, // From Admin Side
  DIRECT_SHIPPING_TO_PRODEX_CONNECT_CUSTOMERS = 44, // Done
  ACCESS_TO_3DILIGENT_BULK_SHIPPING_RATES = 45 // Not Availible
}
