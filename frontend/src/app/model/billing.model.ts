export class Payment {
    id: number;
    customerName: string;
    orderId: number;
    paymentStatusType: PaymentStatusType;
    paymentType: PaymentType;
    poNumber: string;
    note: string;
}




export enum PaymentStatusType {
    WAITING_FOR_APPROVAL = "WAITING_FOR_APPROVAL",
    AWAITING_FOR_RESPONSE = "AWAITING_FOR_RESPONSE",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export enum PaymentType {
    PURCHASE_ORDER = " PURCHASE_ORDER",
    CREDIT_CARD = " CREDIT_CARD"
}
