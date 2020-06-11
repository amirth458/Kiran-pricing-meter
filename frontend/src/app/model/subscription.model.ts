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
