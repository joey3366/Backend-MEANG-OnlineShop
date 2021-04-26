export interface IStripeCard {
    id?: string;
    number: string;
    expMonth: number;
    expYear: number
    cvc: string;
    customer: string;
    brand: string;
    country: string;
}