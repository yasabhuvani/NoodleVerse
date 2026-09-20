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

export type HyderabadArea =
  | 'Jubilee Hills'
  | 'Banjara Hills'
  | 'Madhapur'
  | 'HITEC City'
  | 'Gachibowli'
  | 'Kondapur'
  | 'Begumpet'
  | 'Kokapet';

export interface RestaurantNoodleOption {
  name: string;
  icon: string;
  desc: string;
}

export interface RestaurantBrothOption {
  name: string;
  type: 'Broth' | 'Sauce';
  price: number;
  desc: string;
}

export interface RestaurantProteinOption {
  name: string;
  extraPrice: number;
  icon: string;
  desc: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  description: string;
  cuisine: string;
  cuisineBadges: string[];
  location: string;
  area: HyderabadArea;
  restaurantType: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  priceRange: string;
  approxCostForTwo: number;
  vegetarianAvailable: boolean;
  veganAvailable?: boolean;
  spiceLevels: SpiceLevel[];
  specialties: string[];
  isDemoVendor: boolean;
  demoNote?: string;
  supportedNoodles: RestaurantNoodleOption[];
  supportedBroths: RestaurantBrothOption[];
  supportedProteins: RestaurantProteinOption[];
  supportedVegetables: string[];
  supportedToppings: string[];
  menuItemIds: string[];
  openingHours?: string;
}

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
  restaurantId?: string;
  restaurantArea?: HyderabadArea;
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
  restaurantId?: string;
  restaurantName?: string;
  restaurantArea?: string;
  customDetails?: {
    restaurantId?: string;
    restaurantName?: string;
    restaurantLocation?: string;
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
  restaurantId?: string;
  restaurantName?: string;
  restaurantLocation?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  pickupToken?: string;
  estimatedPrepTime?: string;
  createdAt: string;
  items: OrderItemSummary[];
  subtotal: number;
  taxes?: number;
  deliveryFee: number;
  total: number;
  pickupLocation: PickupLocation;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  minimalPackaging: boolean;
  userEmail: string;
  userName: string;
  restaurantId?: string;
  restaurantName?: string;
  restaurantLocation?: string;
}

export interface CustomBowlState {
  restaurantId: string;
  restaurantName: string;
  restaurantLocation: string;
  noodle: string;
  broth: string;
  protein: string;
  vegetables: string[];
  toppings: string[];
  spiceLevel: SpiceLevel;
}
