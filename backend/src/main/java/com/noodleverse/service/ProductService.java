package com.noodleverse.service;

import com.noodleverse.dto.ProductDto;
import com.noodleverse.entity.Product;
import com.noodleverse.exception.ResourceNotFoundException;
import com.noodleverse.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<Product> getAllProducts(String search, String cuisine, String noodleType, String dietType, String spiceLevel) {
        String s = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String c = (cuisine != null && !cuisine.trim().isEmpty() && !cuisine.equalsIgnoreCase("All")) ? cuisine.trim() : null;
        String n = (noodleType != null && !noodleType.trim().isEmpty() && !noodleType.equalsIgnoreCase("All")) ? noodleType.trim() : null;
        String d = (dietType != null && !dietType.trim().isEmpty() && !dietType.equalsIgnoreCase("All")) ? dietType.trim() : null;
        String sp = (spiceLevel != null && !spiceLevel.trim().isEmpty() && !spiceLevel.equalsIgnoreCase("All")) ? spiceLevel.trim() : null;

        return productRepository.findWithFilters(s, c, n, d, sp);
    }

    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Product createProduct(ProductDto dto) {
        Product product = new Product();
        product.setName(dto.getName().trim());
        product.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : "");
        product.setPrice(dto.getPrice());
        product.setCuisine(dto.getCuisine().trim());
        product.setCountry(dto.getCountry().trim());
        product.setNoodleType(dto.getNoodleType().trim());
        product.setCategory(dto.getCategory() != null ? dto.getCategory().trim() : "Specialty");
        product.setDietType(dto.getDietType().trim());
        product.setSpiceLevel(dto.getSpiceLevel().trim());
        product.setImageUrl(dto.getImageUrl() != null && !dto.getImageUrl().trim().isEmpty()
                ? dto.getImageUrl().trim()
                : "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80");
        product.setRestaurantName(dto.getRestaurantName() != null && !dto.getRestaurantName().trim().isEmpty()
                ? dto.getRestaurantName().trim()
                : "Artisanal Kitchen");
        product.setStock(dto.getStock());
        product.setCreatedAt(LocalDateTime.now());

        return productRepository.save(product);
    }

    public Product updateStock(Long productId, int quantityChange) {
        Product product = getProductById(productId);
        int newStock = product.getStock() + quantityChange;
        if (newStock < 0) {
            throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
        }
        product.setStock(newStock);
        return productRepository.save(product);
    }
}
