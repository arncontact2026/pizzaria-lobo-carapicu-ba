export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: CategorySlug;
  sizes?: Size[];
  crusts?: Crust[];
  extras?: Extra[];
  priceBrotinho?: number;
  ingredients?: string[];
}

export type CategorySlug = 'queijo' | 'calabresa' | 'carnes' | 'frango' | 'legumes' | 'presunto' | 'frutos-do-mar' | 'especiais' | 'doces' | 'batatas' | 'pasteis' | 'bebidas';

export interface Category {
  slug: CategorySlug;
  name: string;
  icon: string;
}

export interface Size {
  name: string;
  price: number;
}

export interface Crust {
  name: string;
  price: number;
}

export interface Extra {
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  product: Product;
  size: Size | null;
  crust: Crust | null;
  extras: Extra[];
  quantity: number;
  observations: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  reference: string;
}

export type PaymentMethod = 'pix' | 'card' | 'cash';

export interface CheckoutData {
  customer: CustomerInfo;
  payment: PaymentMethod;
  cashAmount: string;
}
