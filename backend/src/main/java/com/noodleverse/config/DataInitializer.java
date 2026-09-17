package com.noodleverse.config;

import com.noodleverse.entity.Product;
import com.noodleverse.entity.User;
import com.noodleverse.repository.ProductRepository;
import com.noodleverse.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(ProductRepository productRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed default demo user
        if (userRepository.findByEmail("demo@noodleverse.com").isEmpty()) {
            User demoUser = new User();
            demoUser.setName("Chef Noodle Explorer");
            demoUser.setEmail("demo@noodleverse.com");
            demoUser.setPassword(passwordEncoder.encode("demo123"));
            userRepository.save(demoUser);
        }

        // Seed products if catalogue is empty
        if (productRepository.count() == 0) {
            List<Product> initialProducts = Arrays.asList(
                new Product(null, "Tokyo Shoyu Ramen",
                    "Classic Tokyo-style clear soy sauce broth with handmade wheat ramen noodles, marinated bamboo shoots, nori, and ajitsuke tamago.",
                    new BigDecimal("299"), "Japanese", "Japan", "Ramen", "Signature", "EGG", "MILD",
                    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
                    "Tokyo Menya Artisans", 25, LocalDateTime.now()),

                new Product(null, "Spicy Miso Ramen",
                    "Rich fermented Hokkaido red miso broth with wavy ramen noodles, charred sweet corn, wood ear mushrooms, chili oil, and scallions.",
                    new BigDecimal("329"), "Japanese", "Japan", "Ramen", "Spicy", "VEGETARIAN", "HOT",
                    "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800&auto=format&fit=crop&q=80",
                    "Sapporo Noodle Lab", 18, LocalDateTime.now()),

                new Product(null, "Hanoi Beef Pho",
                    "Traditional 14-hour simmered star anise & cinnamon bone broth with flat rice noodles, fresh herbs, lime wedge, and bean sprouts.",
                    new BigDecimal("279"), "Vietnamese", "Vietnam", "Pho", "Comfort Broth", "NON_VEGETARIAN", "MILD",
                    "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80",
                    "Old Quarter Pho House", 20, LocalDateTime.now()),

                new Product(null, "Bangkok Pad Thai",
                    "Wok-tossed rice noodles with golden tofu, crushed roasted peanuts, fresh lime, garlic chives, and tamarind palm-sugar glaze.",
                    new BigDecimal("249"), "Thai", "Thailand", "Rice Noodles", "Street Food", "VEGETARIAN", "MEDIUM",
                    "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop&q=80",
                    "Siam Street Wok", 30, LocalDateTime.now()),

                new Product(null, "Dan Dan Noodles",
                    "Fiery Sichuan wheat noodles bathed in spicy chili oil, toasted sesame paste, crushed Sichuan peppercorns, preserved greens, and peanuts.",
                    new BigDecimal("269"), "Chinese", "China", "Wheat Noodles", "Fiery", "VEGAN", "HOT",
                    "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
                    "Chengdu Spice Alley", 15, LocalDateTime.now()),

                new Product(null, "Singapore Laksa Lemak",
                    "Aromatic spicy coconut curry noodle soup with thick vermicelli, tofu puffs, bean sprouts, hard-boiled egg, and sambal paste.",
                    new BigDecimal("319"), "Singaporean", "Singapore", "Vermicelli", "Curry Noodle", "EGG", "HOT",
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
                    "Katong Straits Kitchen", 12, LocalDateTime.now()),

                new Product(null, "Korean Bibim Guksu",
                    "Refreshing chilled thin somyeon noodles tossed in spicy, tangy gochujang sauce with crisp julienned cucumbers, radish, and sesame seeds.",
                    new BigDecimal("239"), "Korean", "Korea", "Somyeon", "Chilled", "VEGAN", "MEDIUM",
                    "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=800&auto=format&fit=crop&q=80",
                    "Seoul Hanok Eats", 22, LocalDateTime.now()),

                new Product(null, "Indonesian Mie Goreng",
                    "Savory Indonesian stir-fried egg noodles with sweet kecap manis, shredded cabbage, shallots, garlic crisps, and sunny-side egg.",
                    new BigDecimal("229"), "Indonesian", "Indonesia", "Egg Noodles", "Street Classic", "EGG", "MEDIUM",
                    "https://images.unsplash.com/photo-1594998893017-36147cbcae05?w=800&auto=format&fit=crop&q=80",
                    "Warung Nusantara", 25, LocalDateTime.now()),

                new Product(null, "Kyoto Matcha Soba",
                    "Earthy green tea buckwheat soba noodles served chilled with tsuyu dipping broth, grated wasabi, shredded nori, and daikon radish.",
                    new BigDecimal("289"), "Japanese", "Japan", "Soba", "Artisanal Cold", "VEGAN", "MILD",
                    "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=800&auto=format&fit=crop&q=80",
                    "Gion Zen Noodle House", 14, LocalDateTime.now()),

                new Product(null, "Kolkata Hakka Noodles",
                    "Indo-Chinese street-style stir fried egg noodles tossed with shredded bell peppers, cabbage, dark soy, green chilies, and spring onions.",
                    new BigDecimal("199"), "Indian", "India", "Egg Noodles", "Desi Wok", "VEGETARIAN", "HOT",
                    "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80",
                    "Tiretta Bazaar Wok", 35, LocalDateTime.now()),

                new Product(null, "Penang Char Kway Teow",
                    "Smoky wok-charred flat rice noodles cooked over high heat with garlic chives, crunchy bean sprouts, and dark caramelized soy.",
                    new BigDecimal("259"), "Malaysian", "Malaysia", "Rice Noodles", "Wok Hei", "VEGETARIAN", "MEDIUM",
                    "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80",
                    "George Town Hawkers", 16, LocalDateTime.now()),

                new Product(null, "Buldak Fire Noodles",
                    "Chewy Korean ramyun tossed in tongue-numbing volcanic chili chicken flavor sauce, topped with roasted seaweed flakes and sesame.",
                    new BigDecimal("249"), "Korean", "Korea", "Ramen", "Extreme Spice", "NON_VEGETARIAN", "EXTRA_HOT",
                    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
                    "Hongdae Night Bites", 20, LocalDateTime.now()),

                new Product(null, "Osaka Kitsune Udon",
                    "Thick, chewy Japanese wheat udon noodles in dashi broth topped with a large sweet simmered seasoned aburaage tofu pocket.",
                    new BigDecimal("269"), "Japanese", "Japan", "Udon", "Traditional Broth", "VEGETARIAN", "MILD",
                    "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&auto=format&fit=crop&q=80",
                    "Dotonbori Udon Pavilion", 15, LocalDateTime.now()),

                new Product(null, "Xi'an Biang Biang Noodles",
                    "Wide hand-ripped belt noodles tossed with hot smoking chili oil, minced garlic, black vinegar, and crisp bok choy.",
                    new BigDecimal("279"), "Chinese", "China", "Hand-pulled", "Handmade Ribbon", "VEGAN", "HOT",
                    "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80",
                    "Silk Road Noodle Co.", 18, LocalDateTime.now()),

                new Product(null, "Thai Drunken Noodles (Pad Kee Mao)",
                    "Broad rice noodles stir-fried with fragrant holy basil, baby corn, yardlong beans, red bird's eye chilies, and garlic.",
                    new BigDecimal("259"), "Thai", "Thailand", "Rice Noodles", "Aromatic Wok", "VEGETARIAN", "EXTRA_HOT",
                    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
                    "Chiang Mai Night Market", 20, LocalDateTime.now()),

                new Product(null, "Tsukemen (Dipping Ramen)",
                    "Thick artisanal ramen noodles served chilled beside a concentrated, velvety bonito dashi and pork-bone dipping broth with lime wedge and chashu.",
                    new BigDecimal("319"), "Japanese", "Japan", "Tsukemen", "Japanese", "NON_VEGETARIAN", "MEDIUM",
                    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
                    "Rokurinsha Masters", 12, LocalDateTime.now()),

                new Product(null, "Black Garlic Mayu Tonkotsu Ramen",
                    "Rich pork bone broth infused with charred roasted garlic oil (black mayu), springy noodles, wood ear mushrooms, and soft ajitama egg.",
                    new BigDecimal("329"), "Japanese", "Japan", "Ramen", "Japanese", "NON_VEGETARIAN", "MEDIUM",
                    "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=800&q=80",
                    "Kumamoto Ramen Den", 15, LocalDateTime.now()),

                new Product(null, "Spicy Tantanmen Ramen",
                    "Creamy sesame paste and chili rayu broth layered over springy ramen noodles with spiced minced chicken, baby bok choy, and crushed peanuts.",
                    new BigDecimal("279"), "Japanese", "Japan", "Ramen", "Japanese", "NON_VEGETARIAN", "HOT",
                    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
                    "Tokyo Ramen Alley", 18, LocalDateTime.now()),

                new Product(null, "Tori Paitan Chicken Ramen",
                    "Ultra-creamy white chicken potage broth with tender slow-poached chicken breast slices, menma bamboo, scallions, and thin noodles.",
                    new BigDecimal("299"), "Japanese", "Japan", "Ramen", "Japanese", "NON_VEGETARIAN", "MILD",
                    "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80",
                    "Ginza Paitan House", 14, LocalDateTime.now()),

                new Product(null, "Sapporo Butter Corn Miso Ramen",
                    "Hearty red miso broth enriched with a melting pat of Hokkaido butter, sweet golden corn, garlic pork, and wavy yellow egg ramen.",
                    new BigDecimal("289"), "Japanese", "Japan", "Ramen", "Japanese", "NON_VEGETARIAN", "MEDIUM",
                    "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80",
                    "Hokkaido Snow Bowl", 16, LocalDateTime.now()),

                new Product(null, "Yuzu Shio Ramen",
                    "Light golden sea salt broth brightened with fragrant Japanese yuzu citrus zest, mizuna greens, nori sheet, and tender chashu.",
                    new BigDecimal("279"), "Japanese", "Japan", "Ramen", "Japanese", "NON_VEGETARIAN", "MILD",
                    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
                    "Afuri Shinjuku", 20, LocalDateTime.now()),

                new Product(null, "Spicy Kimchi Ramyeon with Rice Cakes",
                    "Zesty Korean instant ramyeon stewed in fermented aged kimchi broth with chewy cylindrical rice cakes (tteok) and melted cheddar.",
                    new BigDecimal("239"), "Korean", "Korea", "Ramen", "Korean", "VEGETARIAN", "HOT",
                    "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
                    "Seoul Soul Kitchen", 22, LocalDateTime.now()),

                new Product(null, "Lanzhou Hand-Pulled Beef Lamian",
                    "Clear five-spice aromatic broth with hand-stretched artisanal lamian noodles, tender braised beef shanks, white radish slices, and chili oil.",
                    new BigDecimal("269"), "Chinese", "China", "Hand-pulled", "Chinese", "NON_VEGETARIAN", "MEDIUM",
                    "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
                    "Silk Road Lamian", 16, LocalDateTime.now()),

                new Product(null, "Taiwanese Braised Beef Noodle Soup",
                    "Tender beef brisket and tendons slow-braised with star anise, dark soy, and rock sugar over thick wheat noodles with pickled mustard greens.",
                    new BigDecimal("319"), "Taiwanese", "Taiwan", "Flat Noodles", "Taiwanese", "NON_VEGETARIAN", "MEDIUM",
                    "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80",
                    "Taipei Noodle Dynasty", 12, LocalDateTime.now()),

                new Product(null, "Chiang Mai Khao Soi Curry Noodles",
                    "Fragrant northern Thai yellow coconut curry noodle soup with tender chicken drumstick, pickled shallots, lime, and crispy fried noodles.",
                    new BigDecimal("279"), "Thai", "Thailand", "Egg Noodles", "Thai", "NON_VEGETARIAN", "HOT",
                    "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
                    "Chiang Mai Kitchen", 18, LocalDateTime.now()),

                new Product(null, "Bun Bo Hue (Spicy Hue Beef Noodle)",
                    "Central Vietnamese lemongrass and chili beef broth with thick cylindrical rice noodles, herbs, lime wedges, and crisp banana blossoms.",
                    new BigDecimal("289"), "Vietnamese", "Vietnam", "Rice Noodles", "Vietnamese", "NON_VEGETARIAN", "HOT",
                    "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
                    "Saigon Corner", 14, LocalDateTime.now()),

                new Product(null, "Indomie Mi Goreng Supreme",
                    "World-famous Indonesian stir-fried instant noodles tossed with sweet kecap manis, fried shallots, spicy chili sambal, and a fried egg.",
                    new BigDecimal("189"), "Indonesian", "Indonesia", "Instant Noodles", "Indonesian", "EGG", "MEDIUM",
                    "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
                    "Jakarta Street Stall", 40, LocalDateTime.now()),

                new Product(null, "Singapore Mei Fun (Curry Vermicelli)",
                    "Fragrant thin rice vermicelli wok-tossed with yellow madras curry powder, julienned red peppers, scallions, scrambled egg, and sesame.",
                    new BigDecimal("229"), "Singaporean", "Singapore", "Vermicelli", "Singaporean", "VEGETARIAN", "MEDIUM",
                    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
                    "Marina Bay Hawkers", 25, LocalDateTime.now()),

                new Product(null, "Desi Schezwan Masala Maggi",
                    "College campus favorite comfort noodles spiked with fiery Schezwan chili paste, sweet butter, roasted cumin, and sautéed green capsicum.",
                    new BigDecimal("149"), "Indian", "India", "Instant Noodles", "Indian", "VEGETARIAN", "HOT",
                    "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80",
                    "Campus Tapri Adda", 50, LocalDateTime.now()),

                new Product(null, "Truffle Mushroom Fettuccine",
                    "Artisanal bronze-die wide ribbon egg noodles tossed in black winter truffle cream sauce, pan-roasted king oyster mushrooms, and parmesan.",
                    new BigDecimal("349"), "Italian", "Italy", "Egg Noodles", "Italian", "VEGETARIAN", "MILD",
                    "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80",
                    "Trattoria Rustica", 10, LocalDateTime.now()),

                new Product(null, "Chilled Spicy Sesame Udon (Hiyashi)",
                    "Refreshing chilled thick Japanese udon noodles dressed in rich toasted sesame tahini sauce, crisp shredded cucumber, radishes, and scallions.",
                    new BigDecimal("249"), "Japanese", "Japan", "Udon", "Japanese", "VEGAN", "MEDIUM",
                    "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=800&q=80",
                    "Kyoto Garden", 15, LocalDateTime.now()),

                new Product(null, "Spicy Garlic Butter Yakisoba",
                    "Wok-seared Japanese wheat noodles smothered in garlic-infused brown yakisoba sauce with shredded cabbage, carrots, pickled red ginger, and aonori.",
                    new BigDecimal("239"), "Japanese", "Japan", "Wheat Noodles", "Japanese", "VEGETARIAN", "MEDIUM",
                    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
                    "Osaka Yatai", 20, LocalDateTime.now())
            );

            productRepository.saveAll(initialProducts);
        }
    }
}
