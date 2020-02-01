export interface PricingBreakdown {
  costSummuryView: Array<ScreenPricingSummary>;
  screenPricingBreakdownView: Array<ScreenPricingBreakdownView>;
}

interface ScreenPricingSummary {
  invoiceItem: string;
  quantity: number;
  unitPrice: number;
  totalInvoiceItem: number;
}

interface ScreenPricingBreakdownView {
  parameterGroup: string;
  invoiceItem: string;
  invoiceLineItem: string;
  lineItemCost: number;
  multiplier: number;
  finalInvoiceItemCost: number;
  qty: number;
}

export interface PricingBreakDown {
  preQuoteRequestId: number;
  processPricingId: number;
}
