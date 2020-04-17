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
