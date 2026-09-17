package com.noodleverse.controller;

import com.noodleverse.dto.CartDto;
import com.noodleverse.dto.CartItemRequest;
import com.noodleverse.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartDto> getCart(@RequestParam(defaultValue = "1") Long userId) {
        CartDto cart = cartService.getCartDto(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    public ResponseEntity<CartDto> addToCart(
            @RequestParam(defaultValue = "1") Long userId,
            @Valid @RequestBody CartItemRequest request) {
        CartDto updated = cartService.addToCart(userId, request);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<CartDto> updateQuantity(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long userId,
            @RequestBody Map<String, Integer> payload) {
        int qty = payload.getOrDefault("quantity", 1);
        CartDto updated = cartService.updateItemQuantity(userId, id, qty);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<CartDto> removeItem(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long userId) {
        CartDto updated = cartService.removeItem(userId, id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestParam(defaultValue = "1") Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
