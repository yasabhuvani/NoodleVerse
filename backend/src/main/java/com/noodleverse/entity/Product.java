package com.noodleverse.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private String cuisine;

    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    private String noodleType;

    private String category;

    @Column(nullable = false)
    private String dietType; // VEGETARIAN, NON_VEGETARIAN, VEGAN, EGG, SEAFOOD

    @Column(nullable = false)
    private String spiceLevel; // MILD, MEDIUM, HOT, EXTRA_HOT

    @Column(length = 1000)
    private String imageUrl;

    private String restaurantName;

    @Column(nullable = false)
    private Integer stock;

    private LocalDateTime createdAt;

    public Product() {
    }

    public Product(Long id, String name, String description, BigDecimal price, String cuisine,
                   String country, String noodleType, String category, String dietType,
                   String spiceLevel, String imageUrl, String restaurantName, Integer stock,
                   LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.cuisine = cuisine;
        this.country = country;
        this.noodleType = noodleType;
        this.category = category;
        this.dietType = dietType;
        this.spiceLevel = spiceLevel;
        this.imageUrl = imageUrl;
        this.restaurantName = restaurantName;
        this.stock = stock;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    @PrePersist
    public void onPrePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getNoodleType() {
        return noodleType;
    }

    public void setNoodleType(String noodleType) {
        this.noodleType = noodleType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDietType() {
        return dietType;
    }

    public void setDietType(String dietType) {
        this.dietType = dietType;
    }

    public String getSpiceLevel() {
        return spiceLevel;
    }

    public void setSpiceLevel(String spiceLevel) {
        this.spiceLevel = spiceLevel;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
