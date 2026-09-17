package com.noodleverse.service;

import com.noodleverse.dto.CartDto;
import com.noodleverse.dto.CartItemDto;
import com.noodleverse.dto.CartItemRequest;
import com.noodleverse.entity.Cart;
import com.noodleverse.entity.CartItem;
import com.noodleverse.entity.Product;
import com.noodleverse.entity.User;
import com.noodleverse.exception.BadRequestException;
import com.noodleverse.exception.ResourceNotFoundException;
import com.noodleverse.repository.CartItemRepository;
import com.noodleverse.repository.CartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductService productService;
    private final AuthService authService;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductService productService,
                       AuthService authService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productService = productService;
        this.authService = authService;
    }

    public Cart getOrCreateCart(Long userId) {
        User user = authService.getUserById(userId);
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart(user);
            return cartRepository.save(newCart);
        });
    }

    public CartDto getCartDto(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return mapToDto(cart);
    }

    public CartDto addToCart(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productService.getProductById(request.getProductId());

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + product.getStock() + " available)");
        }

        // Check if matching item exists (with same custom details)
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()) &&
                                ((item.getCustomDetails() == null && request.getCustomDetails() == null) ||
                                 (item.getCustomDetails() != null && item.getCustomDetails().equals(request.getCustomDetails()))))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int updatedQty = item.getQuantity() + request.getQuantity();
            if (updatedQty > product.getStock()) {
                throw new BadRequestException("Cannot add more. Total in cart exceeds available stock (" + product.getStock() + " available)");
            }
            item.setQuantity(updatedQty);
        } else {
            CartItem newItem = new CartItem(cart, product, request.getQuantity(), product.getPrice(), request.getCustomDetails());
            cart.addItem(newItem);
        }

        Cart saved = cartRepository.save(cart);
        return mapToDto(saved);
    }

    public CartDto updateItemQuantity(Long userId, Long cartItemId, int newQuantity) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to user");
        }

        if (newQuantity <= 0) {
            cart.removeItem(item);
        } else {
            if (newQuantity > item.getProduct().getStock()) {
                throw new BadRequestException("Only " + item.getProduct().getStock() + " available in stock");
            }
            item.setQuantity(newQuantity);
        }

        Cart saved = cartRepository.save(cart);
        return mapToDto(saved);
    }

    public CartDto removeItem(Long userId, Long cartItemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to user");
        }

        cart.removeItem(item);
        Cart saved = cartRepository.save(cart);
        return mapToDto(saved);
    }

    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.clear();
        cartRepository.save(cart);
    }

    private CartDto mapToDto(Cart cart) {
        CartDto dto = new CartDto();
        dto.setId(cart.getId());

        List<CartItemDto> itemDtos = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        int count = 0;
        boolean hasEco = false;

        for (CartItem item : cart.getItems()) {
            CartItemDto itemDto = new CartItemDto();
            itemDto.setId(item.getId());
            itemDto.setProductId(item.getProduct().getId());
            itemDto.setProductName(item.getProduct().getName());
            itemDto.setPrice(item.getPrice());
            itemDto.setQuantity(item.getQuantity());

            BigDecimal subtotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            itemDto.setSubtotal(subtotal);
            itemDto.setImageUrl(item.getProduct().getImageUrl());
            itemDto.setCountry(item.getProduct().getCountry());
            itemDto.setCountryFlag(getCountryFlag(item.getProduct().getCountry()));
            itemDto.setCuisine(item.getProduct().getCuisine());
            itemDto.setNoodleType(item.getProduct().getNoodleType());
            itemDto.setDietType(item.getProduct().getDietType());
            itemDto.setAvailableStock(item.getProduct().getStock());
            itemDto.setCustomDetails(item.getCustomDetails());

            if ("VEGETARIAN".equalsIgnoreCase(item.getProduct().getDietType()) ||
                "VEGAN".equalsIgnoreCase(item.getProduct().getDietType())) {
                hasEco = true;
            }

            total = total.add(subtotal);
            count += item.getQuantity();
            itemDtos.add(itemDto);
        }

        dto.setItems(itemDtos);
        dto.setTotal(total);
        dto.setItemCount(count);
        dto.setHasEcoChoice(hasEco);
        return dto;
    }

    private String getCountryFlag(String country) {
        if (country == null) return "🍜";
        return switch (country.toLowerCase()) {
            case "japan" -> "🇯🇵";
            case "korea" -> "🇰🇷";
            case "china" -> "🇨🇳";
            case "thailand" -> "🇹🇭";
            case "vietnam" -> "🇻🇳";
            case "india" -> "🇮🇳";
            case "indonesia" -> "🇮🇩";
            case "malaysia" -> "🇲🇾";
            case "singapore" -> "🇸🇬";
            case "philippines" -> "🇵🇭";
            default -> "🍜";
        };
    }
}
