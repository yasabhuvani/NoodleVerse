import { Product, CartItem, Order, OrderStatus, User, DietType, SpiceLevel, PickupLocation, PaymentMethod, CustomBowlState, Restaurant, HyderabadArea } from '../types';
import { INITIAL_PRODUCTS, COUNTRY_FLAG_MAP, FALLBACK_NOODLE_IMAGE } from '../data/initialProducts';
import { HYDERABAD_RESTAURANTS, HYDERABAD_AREAS } from '../data/restaurantsData';

const STORAGE_KEYS = {
  PRODUCTS: 'noodleverse_products_v1',
  CART: 'noodleverse_cart_v1',
  ORDERS: 'noodleverse_orders_v1',
  CURRENT_USER: 'noodleverse_current_user_v1',
  USERS: 'noodleverse_users_v1',
  RESTAURANTS: 'noodleverse_restaurants_v1',
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

// Ensure initial database seeding in localStorage and keep catalog images up-to-date
export function initializeStorage(): void {
  const existingProducts = getStorage<Product[] | null>(STORAGE_KEYS.PRODUCTS, null);
  if (!existingProducts || existingProducts.length === 0) {
    setStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  } else {
    // Synchronize pre-seeded items with verified updated assets (like authentic images)
    const initialMap = new Map(INITIAL_PRODUCTS.map((p) => [String(p.id), p]));
    const updated = existingProducts.map((p) => {
      const init = initialMap.get(String(p.id));
      if (init) {
        return {
          ...init,
          stock: typeof p.stock === 'number' ? p.stock : init.stock, // preserve live inventory status
        };
      }
      return p;
    });

    // Add any newly introduced initial products
    for (const init of INITIAL_PRODUCTS) {
      if (!updated.some((p) => String(p.id) === String(init.id))) {
        updated.push(init);
      }
    }
    setStorage(STORAGE_KEYS.PRODUCTS, updated);
  }

  const existingRestaurants = getStorage<Restaurant[] | null>(STORAGE_KEYS.RESTAURANTS, null);
  if (!existingRestaurants || existingRestaurants.length === 0) {
    setStorage(STORAGE_KEYS.RESTAURANTS, HYDERABAD_RESTAURANTS);
  } else {
    // Keep demo data synchronized with latest configurations
    const initRestMap = new Map(HYDERABAD_RESTAURANTS.map((r) => [r.id, r]));
    const merged = existingRestaurants.map((r) => initRestMap.get(r.id) || r);
    for (const initR of HYDERABAD_RESTAURANTS) {
      if (!merged.some((r) => r.id === initR.id)) {
        merged.push(initR);
      }
    }
    setStorage(STORAGE_KEYS.RESTAURANTS, merged);
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

    // Cuisine filter (flexible match on cuisine or country name)
    if (filters?.cuisine && filters.cuisine !== 'All') {
      const c = filters.cuisine.toLowerCase();
      list = list.filter(
        (p) =>
          p.cuisine.toLowerCase() === c ||
          p.country.toLowerCase() === c ||
          p.cuisine.toLowerCase().startsWith(c.slice(0, 4)) ||
          p.country.toLowerCase().startsWith(c.slice(0, 4))
      );
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

    const isCustom = Boolean(
      customDetails ||
      (product as any).isCustomBowl ||
      String(product.id).startsWith('custom_')
    );

    // Fresh stock check against product storage for catalog items
    const products = getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const liveProduct = products.find((p) => String(p.id) === String(product.id)) || (isCustom ? product : null);

    if (!liveProduct) {
      throw new Error('This noodle is currently unavailable.');
    }

    if (!isCustom && liveProduct.stock <= 0) {
      throw new Error(`Sorry, "${liveProduct.name}" is currently out of stock.`);
    }

    const cart = getStorage<CartItem[]>(STORAGE_KEYS.CART, []);

    // For regular products (not custom bowl), check existing cart item
    const existingIndex = cart.findIndex(
      (item) => String(item.productId) === String(product.id) && !item.customDetails && !customDetails
    );

    if (existingIndex > -1 && !isCustom) {
      const newTotalQty = cart[existingIndex].quantity + quantity;
      if (newTotalQty > liveProduct.stock) {
        throw new Error(
          `Only ${liveProduct.stock} portions of ${liveProduct.name} are available. You already have ${cart[existingIndex].quantity} in your cart.`
        );
      }
      cart[existingIndex].quantity = newTotalQty;
    } else {
      if (!isCustom && quantity > liveProduct.stock) {
        throw new Error(`Only ${liveProduct.stock} portions of ${liveProduct.name} are available.`);
      }

      const newItem: CartItem = {
        id: 'ci_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        productId: product.id,
        product: liveProduct,
        quantity,
        price: product.price,
        restaurantId: customDetails?.restaurantId || product.restaurantId,
        restaurantName: customDetails?.restaurantName || product.restaurantName,
        restaurantArea: customDetails?.restaurantLocation || (product as any).restaurantArea,
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

    const isCustom = Boolean(
      item.customDetails ||
      item.product?.isCustomBowl ||
      String(item.productId).startsWith('custom_')
    );

    // Validate available stock for catalog products
    if (!isCustom) {
      const products = getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      const liveProduct = products.find((p) => String(p.id) === String(item.productId));

      if (liveProduct && newQuantity > liveProduct.stock) {
        throw new Error(`Only ${liveProduct.stock} portions of ${liveProduct.name} are available.`);
      }
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
    saucePrice: number;
    toppingsPrice: number;
    total: number;
  } {
    const basePrice = 149;
    let proteinPrice = 0;

    switch (state.protein) {
      case 'Chicken':
        proteinPrice = 60;
        break;
      case 'Egg':
        proteinPrice = 20;
        break;
      case 'Tofu':
        proteinPrice = 35;
        break;
      case 'Prawn':
        proteinPrice = 90;
        break;
      case 'Beef':
        proteinPrice = 80;
        break;
      case 'None':
      default:
        proteinPrice = 0;
        break;
    }

    // Premium sauce: +₹30 for Tonkotsu, Curry, Peanut, Sweet & Spicy, Gochujang-style, Khao Soi Curry
    const premiumSauces = ['Tonkotsu', 'Curry', 'Peanut', 'Sweet & Spicy', 'Golden Curry', 'Roasted Peanut', 'Gochujang-style', 'Khao Soi Curry'];
    const saucePrice = premiumSauces.includes(state.broth) ? 30 : 0;

    // Extra topping +₹20 each
    const toppingsPrice = Math.max(0, state.toppings.length) * 20;

    return {
      basePrice,
      proteinPrice,
      saucePrice,
      toppingsPrice,
      total: basePrice + proteinPrice + saucePrice + toppingsPrice,
    };
  },

  createCustomProduct(state: CustomBowlState): Product {
    const priceCalc = this.calculatePrice(state);
    const id = 'custom_' + Date.now();

    const restaurantPrefix = state.restaurantName ? `${state.restaurantName} — ` : '';
    const bowlName = `${restaurantPrefix}Custom ${state.noodle} Bowl`;

    const desc = `Custom Bowl prepared by ${state.restaurantName || 'NoodleVerse Partner Kitchen'} (${state.restaurantLocation || 'Hyderabad'}): ${state.noodle} noodles in ${state.broth} broth/sauce, paired with ${state.protein !== 'None' ? state.protein : 'fresh greens'}, crunchy ${state.vegetables.join(', ') || 'seasonal veggies'}, and topped with ${state.toppings.join(', ') || 'artisan seasonings'}. Spice Heat: ${state.spiceLevel}.`;

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
      name: bowlName,
      description: desc,
      price: priceCalc.total,
      cuisine: 'Hyderabad Noodle Craft',
      country: 'India',
      countryFlag: '🍜',
      noodleType: state.noodle,
      category: 'Custom Bowl',
      dietType,
      spiceLevel: state.spiceLevel,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
      restaurantName: state.restaurantName || 'Tokyo Noodle House — Hyderabad',
      restaurantId: state.restaurantId || 'rest_tokyo_noodle_house',
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

    // Validate live stock before placing order for catalog items
    const products = getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);

    for (const item of cart) {
      const isCustom = Boolean(
        item.customDetails ||
        item.product?.isCustomBowl ||
        String(item.productId).startsWith('custom_')
      );
      if (isCustom) {
        continue;
      }
      const liveProduct = products.find((p) => String(p.id) === String(item.productId));
      if (!liveProduct) {
        throw new Error(`Product "${item.product.name}" is no longer available.`);
      }
      if (item.quantity > liveProduct.stock) {
        throw new Error(`Not enough stock available for "${liveProduct.name}". Only ${liveProduct.stock} left.`);
      }
    }

    // Deduct stock for catalog items
    for (const item of cart) {
      const isCustom = Boolean(
        item.customDetails ||
        item.product?.isCustomBowl ||
        String(item.productId).startsWith('custom_')
      );
      if (isCustom) continue;
      const liveProduct = products.find((p) => String(p.id) === String(item.productId));
      if (liveProduct && !liveProduct.isCustomBowl) {
        liveProduct.stock = Math.max(0, liveProduct.stock - item.quantity);
      }
    }
    setStorage(STORAGE_KEYS.PRODUCTS, products);

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxes = Math.round(subtotal * 0.05); // 5% GST
    const deliveryFee = 0; // Free demo pickup
    const total = subtotal + taxes + deliveryFee;

    const orderNumber = String(Math.floor(1000 + Math.random() * 9000));
    const pickupToken = `NV-T${Math.floor(100 + Math.random() * 900)}`;

    // Identify primary restaurant from the items
    const firstCustom = cart.find((i) => i.customDetails?.restaurantName || i.restaurantName);
    const orderRestaurantName =
      firstCustom?.customDetails?.restaurantName ||
      firstCustom?.restaurantName ||
      cart[0]?.product?.restaurantName ||
      'Tokyo Noodle House';
    const orderRestaurantId =
      firstCustom?.customDetails?.restaurantId ||
      firstCustom?.restaurantId ||
      cart[0]?.product?.restaurantId ||
      'rest_tokyo_noodle_house';
    const orderRestaurantLocation =
      firstCustom?.customDetails?.restaurantLocation ||
      firstCustom?.restaurantArea ||
      'Hyderabad';

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      orderNumber,
      pickupToken,
      estimatedPrepTime: '20–25 minutes',
      createdAt: new Date().toISOString(),
      restaurantId: orderRestaurantId,
      restaurantName: orderRestaurantName,
      restaurantLocation: orderRestaurantLocation,
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
        restaurantId: item.restaurantId || item.customDetails?.restaurantId || item.product.restaurantId,
        restaurantName: item.restaurantName || item.customDetails?.restaurantName || item.product.restaurantName,
        restaurantLocation: item.restaurantArea || item.customDetails?.restaurantLocation,
      })),
      subtotal,
      taxes,
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

  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    initializeStorage();
    const orders = getStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');
    order.status = newStatus;
    setStorage(STORAGE_KEYS.ORDERS, orders);
    return order;
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

// Hyderabad Restaurants & Vendors API
export const restaurantService = {
  getAllAreas(): HyderabadArea[] {
    return HYDERABAD_AREAS;
  },

  async getRestaurants(filters?: {
    search?: string;
    cuisine?: string;
    area?: string;
    noodleType?: string;
    vegetarianOnly?: boolean;
    veganOnly?: boolean;
    maxPrice?: number;
    sortBy?: 'recommended' | 'rating' | 'price_asc' | 'price_desc' | 'area';
  }): Promise<Restaurant[]> {
    initializeStorage();
    await new Promise((resolve) => setTimeout(resolve, 80));

    let list = getStorage<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, HYDERABAD_RESTAURANTS);

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q) ||
          r.specialties.some((s) => s.toLowerCase().includes(q)) ||
          r.supportedNoodles.some((n) => n.name.toLowerCase().includes(q)) ||
          r.description.toLowerCase().includes(q)
      );
    }

    if (filters?.cuisine && filters.cuisine !== 'ALL') {
      const c = filters.cuisine.toLowerCase();
      list = list.filter(
        (r) =>
          r.cuisine.toLowerCase() === c ||
          r.cuisineBadges.some((b) => b.toLowerCase().includes(c))
      );
    }

    if (filters?.area && filters.area !== 'ALL') {
      list = list.filter((r) => r.area.toLowerCase() === filters.area!.toLowerCase());
    }

    if (filters?.noodleType && filters.noodleType !== 'ALL') {
      const nt = filters.noodleType.toLowerCase();
      list = list.filter((r) =>
        r.supportedNoodles.some((n) => n.name.toLowerCase().includes(nt))
      );
    }

    if (filters?.vegetarianOnly) {
      list = list.filter((r) => r.vegetarianAvailable);
    }

    if (filters?.veganOnly) {
      list = list.filter((r) => r.veganAvailable);
    }

    if (filters?.maxPrice) {
      list = list.filter((r) => r.approxCostForTwo / 2 <= filters.maxPrice!);
    }

    // Sort
    const sortBy = filters?.sortBy || 'recommended';
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price_asc':
          return a.approxCostForTwo - b.approxCostForTwo;
        case 'price_desc':
          return b.approxCostForTwo - a.approxCostForTwo;
        case 'area':
          return a.area.localeCompare(b.area);
        case 'recommended':
        default:
          return b.rating * b.reviewsCount - a.rating * a.reviewsCount;
      }
    });

    return list;
  },

  async getRestaurantById(id: string): Promise<Restaurant> {
    initializeStorage();
    await new Promise((resolve) => setTimeout(resolve, 60));

    const list = getStorage<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, HYDERABAD_RESTAURANTS);
    const found = list.find((r) => r.id === id);
    if (!found) {
      // Fallback to first if not found
      if (list.length > 0) return list[0];
      throw new Error(`Restaurant with id ${id} not found.`);
    }
    return found;
  },

  // Rule-based matching recommendation engine
  findRecommendedRestaurants(preferences: {
    cuisine?: string;
    noodleType?: string;
    vegetarianOnly?: boolean;
    spiceLevel?: SpiceLevel;
    area?: string;
    maxBudget?: number;
  }): { restaurant: Restaurant; score: number; matchReasons: string[] }[] {
    initializeStorage();
    const list = getStorage<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, HYDERABAD_RESTAURANTS);

    return list
      .map((restaurant) => {
        let score = 50; // base score
        const matchReasons: string[] = [];

        // Cuisine match
        if (preferences.cuisine && preferences.cuisine !== 'ALL') {
          const c = preferences.cuisine.toLowerCase();
          if (
            restaurant.cuisine.toLowerCase().includes(c) ||
            restaurant.cuisineBadges.some((b) => b.toLowerCase().includes(c))
          ) {
            score += 30;
            matchReasons.push(`Authentic ${restaurant.cuisine} culinary heritage`);
          }
        }

        // Noodle type match
        if (preferences.noodleType && preferences.noodleType !== 'ALL') {
          const nt = preferences.noodleType.toLowerCase();
          const hasNoodle = restaurant.supportedNoodles.some((n) =>
            n.name.toLowerCase().includes(nt)
          );
          if (hasNoodle) {
            score += 25;
            matchReasons.push(`Specializes in fresh ${preferences.noodleType} noodles`);
          }
        }

        // Area match
        if (preferences.area && preferences.area !== 'ALL') {
          if (restaurant.area.toLowerCase() === preferences.area.toLowerCase()) {
            score += 25;
            matchReasons.push(`Located directly in ${restaurant.area} for fastest preparation`);
          }
        }

        // Vegetarian filter
        if (preferences.vegetarianOnly) {
          if (restaurant.vegetarianAvailable) {
            score += 15;
            matchReasons.push('Dedicated vegetarian broth & plant proteins available');
          } else {
            score -= 40;
          }
        }

        // Spice level
        if (preferences.spiceLevel) {
          if (restaurant.spiceLevels.includes(preferences.spiceLevel)) {
            score += 10;
            matchReasons.push(`Supports ${preferences.spiceLevel} spice heat level`);
          }
        }

        // Budget match
        if (preferences.maxBudget) {
          const avgPortion = restaurant.approxCostForTwo / 2;
          if (avgPortion <= preferences.maxBudget) {
            score += 10;
            matchReasons.push(`Within your ₹${preferences.maxBudget} budget`);
          }
        }

        // High rating bonus
        if (restaurant.rating >= 4.8) {
          score += 8;
          matchReasons.push(`Top customer rating (${restaurant.rating} ★)`);
        }

        return {
          restaurant,
          score,
          matchReasons: matchReasons.slice(0, 3),
        };
      })
      .sort((a, b) => b.score - a.score);
  },
};
