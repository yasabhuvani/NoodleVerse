export type DietType = 'VEGETARIAN' | 'NON_VEGETARIAN' | 'VEGAN' | 'EGG' | 'SEAFOOD';

export type SpiceLevel = 'MILD' | 'MEDIUM' | 'HOT' | 'EXTRA_HOT';

export type ServingStyle = 'SOUP' | 'DRY' | 'DIPPING' | 'CHILLED';

export type OrderStatus = 'PLACED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'COMPLETED';

export type PickupLocation = 
  | 'Campus Food Court'
  | 'Main Gate'
  | 'Hostel'
  | 'Library'
  | 'Student Activity Centre';

export type PaymentMethod = 'CASH_ON_PICKUP' | 'DEMO_PAYMENT';

export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number; // in INR
  cuisine: string;
  country: string;
  countryFlag: string;
  noodleType: string;
  category: string;
  dietType: DietType;
  spiceLevel: SpiceLevel;
  servingStyle?: ServingStyle;
  imageUrl: string;
  restaurantName: string;
  stock: number;
  createdAt: string;
  isCustomBowl?: boolean;
  customDetails?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CartItem {
  id: string;
  productId: string | number;
  product: Product;
  quantity: number;
  price: number;
  customDetails?: {
    noodle: string;
    broth: string;
    protein: string;
    vegetables: string[];
    toppings: string[];
    spiceLevel: SpiceLevel;
  };
}

export interface OrderItemSummary {
  id: string;
  productId: string | number;
  productName: string;
  price: number;
  quantity: number;
  country: string;
  countryFlag: string;
  cuisine: string;
  dietType: DietType;
  customDetails?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItemSummary[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  pickupLocation: PickupLocation;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  minimalPackaging: boolean;
  userEmail: string;
  userName: string;
}

export interface CustomBowlState {
  noodle: string;
  broth: string;
  protein: string;
  vegetables: string[];
  toppings: string[];
  spiceLevel: SpiceLevel;
}
