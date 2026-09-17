import { Product, CartItem, Order, User, DietType, SpiceLevel, PickupLocation, PaymentMethod, CustomBowlState } from '../types';
import { INITIAL_PRODUCTS, COUNTRY_FLAG_MAP, FALLBACK_NOODLE_IMAGE } from '../data/initialProducts';

const STORAGE_KEYS = {
  PRODUCTS: 'noodleverse_products_v1',
  CART: 'noodleverse_cart_v1',
  ORDERS: 'noodleverse_orders_v1',
  CURRENT_USER: 'noodleverse_current_user_v1',
  USERS: 'noodleverse_users_v1',
};

// Initial Demo User
const DEMO_USER: User & { passwordHash: string } = {
  id: 'usr_demo',
  name: 'Noodle Explorer',
  email: 'demo@noodleverse.com',
  passwordHash: 'demo123', // In Spring Boot backend this is BCrypt encoded
};

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read ${key} from storage:`, err);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write ${key} to storage:`, err);
  }
}

// Ensure initial database seeding in localStorage
export function initializeStorage(): void {
  const existingProducts = getStorage<Product[] | null>(STORAGE_KEYS.PRODUCTS, null);
  if (!existingProducts || existingProducts.length < INITIAL_PRODUCTS.length) {
    const userAdded = (existingProducts || []).filter((p) => String(p.id).startsWith('prod_'));
    setStorage(STORAGE_KEYS.PRODUCTS, [...INITIAL_PRODUCTS, ...userAdded]);
  }

  const existingUsers = getStorage<any[] | null>(STORAGE_KEYS.USERS, null);
  if (!existingUsers || existingUsers.length === 0) {
    setStorage(STORAGE_KEYS.USERS, [DEMO_USER]);
  }
}

// Authentication API
export const authService = {
  getCurrentUser(): User | null {
    initializeStorage();
    return getStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  async login(email: string, password: string): Promise<User> {
    initializeStorage();
    await new Promise((resolve) => setTimeout(resolve, 300));

    const users = getStorage<any[]>(STORAGE_KEYS.USERS, [DEMO_USER]);
    const normalizedEmail = email.trim().toLowerCase();

    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user || user.passwordHash !== password) {
      throw new Error('Invalid email or password.');
    }

    const sessionUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    setStorage(STORAGE_KEYS.CURRENT_USER, sessionUser);
    return sessionUser;
  },

  async register(name: string, email: string, password: string): Promise<User> {
    initializeStorage();
    await new Promise((resolve) => setTimeout(resolve, 350));

    const users = getStorage<any[]>(STORAGE_KEYS.USERS, [DEMO_USER]);
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('This email is already registered.');
    }

    if (!name.trim() || !normalizedEmail || !password) {
      throw new Error('Please provide your name, email, and password.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: password,
    };

    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);

    const sessionUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    setStorage(STORAGE_KEYS.CURRENT_USER, sessionUser);
    return sessionUser;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
};

// Products API
export const productService = {
  async getProducts(filters?: {
    search?: string;
    cuisine?: string;
    noodleType?: string;
    dietType?: string;
    spiceLevel?: string;
    servingStyle?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    quickCategory?: string;
    sortBy?: string;
  }): Promise<Product[]> {
    initializeStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));

    let list = getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);

    // Quick Category Tag Filter
    if (filters?.quickCategory && filters.quickCategory !== 'all') {
      const cat = filters.quickCategory;
      if (cat === 'ramen') {
        list = list.filter(
          (p) =>
            p.noodleType.toLowerCase() === 'ramen' ||
            p.noodleType.toLowerCase() === 'tsukemen' ||
            p.name.toLowerCase().includes('ramen') ||
            p.name.toLowerCase().includes('ramyeon')
        );
      } else if (cat === 'soup') {
        list = list.filter(
          (p) =>
            p.servingStyle === 'SOUP' ||
            p.description.toLowerCase().includes('broth') ||
            p.description.toLowerCase().includes('soup')
        );
      } else if (cat === 'stir-fried') {
        list = list.filter(
          (p) =>
            p.servingStyle === 'DRY' ||
            p.description.toLowerCase().includes('stir-fried') ||
            p.description.toLowerCase().includes('wok') ||
            p.description.toLowerCase().includes('tossed')
        );
      } else if (cat === 'spicy') {
        list = list.filter((p) => p.spiceLevel === 'HOT' || p.spiceLevel === 'EXTRA_HOT');
      } else if (cat === 'veg') {
        list = list.filter((p) => p.dietType === 'VEGETARIAN' || p.dietType === 'VEGAN');
      } else if (cat === 'hand-pulled') {
        list = list.filter(
          (p) =>
            p.noodleType.toLowerCase().includes('hand-pulled') ||
            p.noodleType.toLowerCase().includes('lamian') ||
            p.name.toLowerCase().includes('lamian') ||
            p.description.toLowerCase().includes('hand')
        );
      } else if (cat === 'budget') {
        list = list.filter((p) => p.price <= 250);
      }
    }

    // Text Search
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.cuisine.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.noodleType.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Cuisine filter
    if (filters?.cuisine && filters.cuisine !== 'All') {
      list = list.filter((p) => p.cuisine.toLowerCase() === filters.cuisine!.toLowerCase());
    }

    // Noodle Type filter
    if (filters?.noodleType && filters.noodleType !== 'All') {
      list = list.filter((p) => p.noodleType.toLowerCase() === filters.noodleType!.toLowerCase());
    }

    // Diet Type filter
    if (filters?.dietType && filters.dietType !== 'All') {
      list = list.filter((p) => p.dietType === filters.dietType);
    }

    // Spice Level filter
    if (filters?.spiceLevel && filters.spiceLevel !== 'All') {
      list = list.filter((p) => p.spiceLevel === filters.spiceLevel);
    }

    // Serving Style filter
    if (filters?.servingStyle && filters.servingStyle !== 'All') {
      list = list.filter((p) => p.servingStyle === filters.servingStyle);
    }

    // Price Range filter
    if (filters?.minPrice !== undefined && filters.minPrice > 0) {
      list = list.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined && filters.maxPrice < 9999) {
      list = list.filter((p) => p.price <= filters.maxPrice!);
    }

    // In Stock Only
    if (filters?.inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    // Sorting
    if (filters?.sortBy) {
      const spiceWeight: Record<string, number> = {
        MILD: 1,
        MEDIUM: 2,
        HOT: 3,
        EXTRA_HOT: 4,
      };

      switch (filters.sortBy) {
        case 'PRICE_ASC':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'PRICE_DESC':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'SPICE_ASC':
          list.sort((a, b) => (spiceWeight[a.spiceLevel] || 0) - (spiceWeight[b.spiceLevel] || 0));
          break;
        case 'SPICE_DESC':
          list.sort((a, b) => (spiceWeight[b.spiceLevel] || 0) - (spiceWeight[a.spiceLevel] || 0));
          break;
        case 'NAME_ASC':
          list.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'STOCK_DESC':
          list.sort((a, b) => b.stock - a.stock);
          break;
        case 'FEATURED':
        default:
          // Default featured order keeps curated diversity
          break;
      }
    }

    return list;
  },

  async getProductById(id: string | number): Promise<Product> {
    initializeStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const list = getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const product = list.find((p) => String(p.id) === String(id));
    if (!product) {
      throw new Error('This noodle is currently unavailable.');
    }
    return product;
  },

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    cuisine: string;
    country: string;
    noodleType: string;
    dietType: DietType;
    spiceLevel: SpiceLevel;
    imageUrl: string;
    restaurantName: string;
    stock: number;
  }): Promise<Product> {
    initializeStorage();
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!data.name.trim()) throw new Error('Noodle name is required.');
    if (!data.price || data.price <= 0) throw new Error('Valid price is required.');
    if (data.stock < 0) throw new Error('Stock cannot be negative.');

    const products = getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);

    const flag = COUNTRY_FLAG_MAP[data.country] || '🌏';
    const newProduct: Product = {
      id: 'prod_' + Date.now(),
      name: data.name.trim(),
      description: data.description.trim() || 'Delicious artisanal noodle dish prepared with authentic spices and fresh herbs.',
      price: Math.round(data.price),
      cuisine: data.cuisine,
      country: data.country,
      countryFlag: flag,
      noodleType: data.noodleType,
      category: data.cuisine,
      dietType: data.dietType,
      spiceLevel: data.spiceLevel,
      imageUrl: data.imageUrl.trim() || FALLBACK_NOODLE_IMAGE,
      restaurantName: data.restaurantName.trim() || 'NoodleVerse Kitchen',
      stock: data.stock,
      createdAt: new Date().toISOString(),
    };

    products.unshift(newProduct);
    setStorage(STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  },
};

// Cart API
export const cartService = {
  getCart(): CartItem[] {
    initializeStorage();
    return getStorage<CartItem[]>(STORAGE_KEYS.CART, []);
  },

  async addToCart(
    product: Product,
    quantity: number,
    customDetails?: CartItem['customDetails']
  ): Promise<CartItem[]> {
    initializeStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Fresh stock check against product storage
    const products = getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const liveProduct = products.find((p) => String(p.id) === String(product.id));

    if (!liveProduct) {
      throw new Error('This noodle is currently unavailable.');
    }

    if (liveProduct.stock <= 0) {
      throw new Error(`Sorry, "${liveProduct.name}" is currently out of stock.`);
    }

    const cart = getStorage<CartItem[]>(STORAGE_KEYS.CART, []);

    // For regular products (not custom bowl), check existing cart item
    const existingIndex = cart.findIndex(
      (item) => String(item.productId) === String(product.id) && !item.customDetails && !customDetails
    );

    if (existingIndex > -1) {
      const newTotalQty = cart[existingIndex].quantity + quantity;
      if (newTotalQty > liveProduct.stock) {
        throw new Error(
          `Only ${liveProduct.stock} portions of ${liveProduct.name} are available. You already have ${cart[existingIndex].quantity} in your cart.`
        );
      }
      cart[existingIndex].quantity = newTotalQty;
    } else {
      if (quantity > liveProduct.stock) {
        throw new Error(`Only ${liveProduct.stock} portions of ${liveProduct.name} are available.`);
      }

      const newItem: CartItem = {
        id: 'ci_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        productId: product.id,
        product: liveProduct,
        quantity,
        price: product.price,
        customDetails,
      };
      cart.push(newItem);
    }

    setStorage(STORAGE_KEYS.CART, cart);
    return cart;
  },

  async updateQuantity(cartItemId: string, newQuantity: number): Promise<CartItem[]> {
    initializeStorage();
    const cart = getStorage<CartItem[]>(STORAGE_KEYS.CART, []);
    const item = cart.find((ci) => ci.id === cartItemId);

    if (!item) return cart;

    if (newQuantity <= 0) {
      return this.removeFromCart(cartItemId);
    }

    // Validate available stock
    const products = getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const liveProduct = products.find((p) => String(p.id) === String(item.productId));

    if (liveProduct && newQuantity > liveProduct.stock) {
      throw new Error(`Only ${liveProduct.stock} portions of ${liveProduct.name} are available.`);
    }

    item.quantity = newQuantity;
    setStorage(STORAGE_KEYS.CART, cart);
    return cart;
  },

  async removeFromCart(cartItemId: string): Promise<CartItem[]> {
    initializeStorage();
    let cart = getStorage<CartItem[]>(STORAGE_KEYS.CART, []);
    cart = cart.filter((ci) => ci.id !== cartItemId);
    setStorage(STORAGE_KEYS.CART, cart);
    return cart;
  },

  clearCart(): void {
    setStorage(STORAGE_KEYS.CART, []);
  },
};

// Custom Bowl Pricing and Builder
export const customBowlService = {
  calculatePrice(state: CustomBowlState): {
    basePrice: number;
    proteinPrice: number;
    toppingsPrice: number;
    total: number;
  } {
    const basePrice = 149;
    let proteinPrice = 0;

    switch (state.protein) {
      case 'Chicken':
        proteinPrice = 60;
        break;
      case 'Beef':
        proteinPrice = 80;
        break;
      case 'Prawn':
        proteinPrice = 90;
        break;
      case 'Egg':
        proteinPrice = 25;
        break;
      case 'Tofu':
        proteinPrice = 35;
        break;
      default:
        proteinPrice = 0;
    }

    // ₹15 per extra topping after first free topping
    const toppingsPrice = Math.max(0, state.toppings.length) * 15;

    return {
      basePrice,
      proteinPrice,
      toppingsPrice,
      total: basePrice + proteinPrice + toppingsPrice,
    };
  },

  createCustomProduct(state: CustomBowlState): Product {
    const priceCalc = this.calculatePrice(state);
    const id = 'custom_' + Date.now();

    const desc = `Custom Bowl: ${state.noodle} noodles in savory ${state.broth} broth, paired with ${state.protein !== 'None' ? state.protein : 'fresh greens'}, crunchy ${state.vegetables.join(', ') || 'veggies'}, and topped with ${state.toppings.join(', ') || 'seasonings'}.`;

    let dietType: DietType = 'VEGAN';
    if (state.protein === 'Chicken' || state.protein === 'Beef') {
      dietType = 'NON_VEGETARIAN';
    } else if (state.protein === 'Prawn') {
      dietType = 'SEAFOOD';
    } else if (state.protein === 'Egg' || state.toppings.includes('Soft Boiled Egg')) {
      dietType = 'EGG';
    } else if (state.protein === 'Tofu') {
      dietType = 'VEGAN';
    }

    return {
      id,
      name: `Custom ${state.noodle} Bowl`,
      description: desc,
      price: priceCalc.total,
      cuisine: 'Global Fusion',
      country: 'Other',
      countryFlag: '🍜',
      noodleType: state.noodle,
      category: 'Custom Bowl',
      dietType,
      spiceLevel: state.spiceLevel,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
      restaurantName: 'NoodleVerse Craft Studio',
      stock: 50, // Always craftable
      createdAt: new Date().toISOString(),
      isCustomBowl: true,
      customDetails: desc,
    };
  },
};

// Orders API
export const orderService = {
  async getOrders(): Promise<Order[]> {
    initializeStorage();
    await new Promise((resolve) => setTimeout(resolve, 150));
    return getStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  async placeOrder(params: {
    pickupLocation: PickupLocation;
    paymentMethod: PaymentMethod;
    minimalPackaging: boolean;
    user: User;
  }): Promise<Order> {
    initializeStorage();
    await new Promise((resolve) => setTimeout(resolve, 400));

    const cart = getStorage<CartItem[]>(STORAGE_KEYS.CART, []);
    if (cart.length === 0) {
      throw new Error('Your cart is empty.');
    }

    // Validate live stock before placing order
    const products = getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);

    for (const item of cart) {
      const liveProduct = products.find((p) => String(p.id) === String(item.productId));
      if (!liveProduct) {
        throw new Error(`Product "${item.product.name}" is no longer available.`);
      }
      if (item.quantity > liveProduct.stock) {
        throw new Error(`Not enough stock available for "${liveProduct.name}". Only ${liveProduct.stock} left.`);
      }
    }

    // Deduct stock
    for (const item of cart) {
      const liveProduct = products.find((p) => String(p.id) === String(item.productId));
      if (liveProduct && !liveProduct.isCustomBowl) {
        liveProduct.stock = Math.max(0, liveProduct.stock - item.quantity);
      }
    }
    setStorage(STORAGE_KEYS.PRODUCTS, products);

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 0; // Free demo pickup
    const total = subtotal + deliveryFee;

    const orderNumber = String(Math.floor(1000 + Math.random() * 9000));
    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      orderNumber,
      createdAt: new Date().toISOString(),
      items: cart.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        price: item.price,
        quantity: item.quantity,
        country: item.product.country,
        countryFlag: item.product.countryFlag,
        cuisine: item.product.cuisine,
        dietType: item.product.dietType,
        customDetails: item.product.customDetails,
        imageUrl: item.product.imageUrl,
      })),
      subtotal,
      deliveryFee,
      total,
      pickupLocation: params.pickupLocation,
      paymentMethod: params.paymentMethod,
      status: 'PLACED',
      minimalPackaging: params.minimalPackaging,
      userEmail: params.user.email,
      userName: params.user.name,
    };

    const existingOrders = getStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
    existingOrders.unshift(newOrder);
    setStorage(STORAGE_KEYS.ORDERS, existingOrders);

    // Clear cart
    setStorage(STORAGE_KEYS.CART, []);

    return newOrder;
  },

  // Sustainability Eco Choice Detection
  hasEcoChoice(items: { dietType: DietType }[]): boolean {
    return items.some((i) => i.dietType === 'VEGETARIAN' || i.dietType === 'VEGAN');
  },

  // Flavor Passport calculation
  getFlavorPassport(orders: Order[]): {
    countries: { name: string; flag: string; count: number }[];
    totalCuisines: number;
    totalBowls: number;
  } {
    const countryMap: Record<string, { flag: string; count: number }> = {};
    const cuisines = new Set<string>();
    let totalBowls = 0;

    for (const order of orders) {
      for (const item of order.items) {
        totalBowls += item.quantity;
        cuisines.add(item.cuisine);

        if (!countryMap[item.country]) {
          countryMap[item.country] = {
            flag: item.countryFlag || COUNTRY_FLAG_MAP[item.country] || '🌏',
            count: 0,
          };
        }
        countryMap[item.country].count += item.quantity;
      }
    }

    const countries = Object.entries(countryMap).map(([name, data]) => ({
      name,
      flag: data.flag,
      count: data.count,
    }));

    return {
      countries,
      totalCuisines: cuisines.size,
      totalBowls,
    };
  },
};
