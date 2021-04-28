export interface IStripeCharge {
    id: string;
    status: string;
    receiptEmail: string;
    receiptUrl: string;
    created: string;
    typeOrder: string;
    description: string;
    card: string;
    customer: string;
    amount: number;
    paid: boolean;
}