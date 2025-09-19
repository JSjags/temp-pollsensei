export interface ICountry {
  _id: string;
  name: string;
}

export interface IRegion {
  _id: string;
  name: string;
}

export interface IPollcoinBundle {
  _id?: string;
  id?: string; // For compatibility
  name: string; // bundle name
  amount: number; // pollcoin amount
  price: number; // cost of pollcoin
  discount_type: string; // none | percentage | bonus
  percentage?: number; // if discount_type is percentage this is required
  bonus?: number; // if discount_type is bonus this is required
  region?: IRegion | string; // region object or region ID string
  countries_to_exempt?: ICountry[] | string[]; // array of country objects or country IDs
  countries_to_include?: ICountry[] | string[]; // array of country objects or country IDs
  tag: string; // early bird
  currency: string; // USD | NGN
  status?: string; // published | unpublished
  is_active?: boolean; // for enabling/disabling (computed from status)
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string; // For compatibility
  updated_at?: string; // For compatibility
  __v?: number;
}
