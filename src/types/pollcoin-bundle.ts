export interface IPollcoinBundle {
  id?: string;
  name: string; // bundle name
  amount: number; // pollcoin amount
  price: number; // cost of pollcoin
  discount_type: string; // none | percentage | bonus
  percentage?: number; // if discount_type is percentage this is required
  bonus?: number; // if discount_type is bonus this is required
  tag: string; // early bird
  currency: string; // USD | NGN
  is_active?: boolean; // for enabling/disabling
  created_at?: string;
  updated_at?: string;
}
