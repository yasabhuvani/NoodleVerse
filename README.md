# 🍜 NoodleVerse - Global Noodle Marketplace

> *"Taste the World, One Noodle at a Time."*

NoodleVerse is an artisanal global noodle marketplace and quick-service platform. It enables noodle lovers to discover authentic regional bowls from Japan, Vietnam, Thailand, China, Korea, Indonesia, and beyond, build personalized custom noodle bowls with real-time price estimation, order for campus pickup, and log their culinary discoveries in an interactive **Flavor Passport**.

---

## 🌟 Key Innovations

1. **Craft-Your-Own Bowl Builder (`/build-bowl`)**
   - 4-step interactive customizer: Base Broth (Shoyu, Tonkotsu, Tom Yum, Laksa, etc.) → Artisanal Noodle Type (Ramen, Udon, Rice, Soba, Somyeon) → Fresh Proteins (Chashu, Tofu, Shrimp, Chicken) → Gourmet Toppings (Ajitsuke Tamago, Nori, Bamboo Shoots, Black Garlic Oil, Wood Ear).
   - Dynamic real-time pricing calculation with breakdown.
   - One-click addition to cart with custom specification tag.

2. **Culinary Flavor Passport (`/orders`)**
   - Dynamically analyzes user order history to calculate country stamps discovered (e.g. 🇯🇵 Japan, 🇰🇷 Korea, 🇹🇭 Thailand, 🇻🇳 Vietnam).
   - Computes progress bar toward "Master Noodle Explorer" status with achievement tiers (Novice Noodle Scout → Street Food Connoisseur → Master Noodle Explorer).

3. **Eco Choices & Sustainability (`/cart`, `/checkout`)**
   - Automatically detects vegetarian and vegan selections and displays carbon-reduction celebratory banners.
   - Minimalist reusable eco-packaging opt-in at zero extra cost.

4. **Multi-Location Campus Pickup (`/checkout`)**
   - Select between Campus Food Court, Main Gate, Hostel, Library, or SAC.
   - Live simulated payment with immediate order generation and stock deduction.

---

## 🏗️ Architecture & Technology Stack

```
noodleverse/
├── backend/                       # Spring Boot 3 Java Backend
│   ├── pom.xml                    # Maven dependencies (JPA, Security, MySQL, Validation)
│   └── src/main/
│       ├── java/com/noodleverse/
│       │   ├── config/            # SecurityConfig, CorsConfig, DataInitializer
│       │   ├── controller/        # AuthController, ProductController, CartController, OrderController
│       │   ├── dto/               # Request/Response DTOs & Validation
│       │   ├── entity/            # User, Product, Cart, CartItem, Order, OrderItem
│       │   ├── exception/         # GlobalExceptionHandler & Custom Exceptions
│       │   ├── repository/        # Spring Data JPA Repositories
│       │   └── service/           # Business Logic, Stock Management & Order Processing
│       └── resources/
│           └── application.properties # Database connection & JPA configuration
│
└── src/                           # React + Vite + Tailwind CSS Frontend
    ├── components/                # Navbar, Footer, ProductCard, Badges, FlavorPassport, EcoBanner
    ├── context/                   # AuthContext, CartContext
    ├── data/                      # Initial authentic noodle catalogue & custom builder options
    ├── pages/                     # Home, Explore, ProductDetails, BuildBowl, Cart, Checkout, Orders, Sell, Login, Register, OrderSuccess
    ├── services/                  # Dual API service layer (Spring Boot backend client + offline localStorage fallback)
    └── types.ts                   # TypeScript domain contracts & types
```

---

## 🚀 Running the Application

### 1. React Web Application (Live in AI Studio Preview)
The frontend runs instantly in this environment with full client-side persistence and mock fallback:
- **Port:** `3000`
- **Demo User:** `demo@noodleverse.com` / `demo123` (Quick 1-click button on login screen)

### 2. Spring Boot 3 Backend Setup
```bash
# 1. Navigate to the backend directory
cd backend

# 2. Make sure MySQL is running on localhost:3306 with database noodleverse_db
# (Spring Boot will auto-create database tables on startup via Hibernate ddl-auto=update)

# 3. Build & run the backend application
mvn spring-boot:run
```
The server will start at `http://localhost:8080` and automatically seed the 15 authentic global noodle dishes and demo user account.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate user & return session |
| `GET` | `/api/products` | Filter catalogue by search, cuisine, noodleType, dietType, spiceLevel |
| `GET` | `/api/products/{id}` | Get detailed product specifications |
| `POST` | `/api/products` | Add new noodle dish to marketplace (Vendor portal) |
| `GET` | `/api/cart` | Get current user's cart |
| `POST` | `/api/cart/add` | Add noodle or custom bowl to cart |
| `PUT` | `/api/cart/items/{id}` | Update item quantity (validates stock) |
| `DELETE`| `/api/cart/items/{id}` | Remove item from cart |
| `POST` | `/api/orders` | Place order, deduct stock, and return Order ID |
| `GET` | `/api/orders` | Retrieve authenticated user's order history |
