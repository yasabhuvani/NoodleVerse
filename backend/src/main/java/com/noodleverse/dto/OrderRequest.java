package com.noodleverse.dto;

import jakarta.validation.constraints.NotBlank;

public class OrderRequest {

    @NotBlank(message = "Pickup location is required")
    private String pickupLocation;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    private Boolean minimalPackaging = false;

    public OrderRequest() {
    }

    public OrderRequest(String pickupLocation, String paymentMethod, Boolean minimalPackaging) {
        this.pickupLocation = pickupLocation;
        this.paymentMethod = paymentMethod;
        this.minimalPackaging = minimalPackaging;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Boolean getMinimalPackaging() {
        return minimalPackaging;
    }

    public void setMinimalPackaging(Boolean minimalPackaging) {
        this.minimalPackaging = minimalPackaging;
    }
}
