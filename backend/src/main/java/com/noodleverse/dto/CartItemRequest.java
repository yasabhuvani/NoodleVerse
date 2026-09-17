package com.noodleverse.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CartItemRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String customDetails;

    public CartItemRequest() {
    }

    public CartItemRequest(Long productId, Integer quantity, String customDetails) {
        this.productId = productId;
        this.quantity = quantity;
        this.customDetails = customDetails;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getCustomDetails() {
        return customDetails;
    }

    public void setCustomDetails(String customDetails) {
        this.customDetails = customDetails;
    }
}
