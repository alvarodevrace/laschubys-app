export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  source: 'owned' | 'affiliate';
  affiliateUrl?: string;
}
