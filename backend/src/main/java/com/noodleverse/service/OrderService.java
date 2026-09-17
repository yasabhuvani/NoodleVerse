package com.noodleverse.service;

import com.noodleverse.dto.OrderDto;
import com.noodleverse.dto.OrderItemDto;
import com.noodleverse.dto.OrderRequest;
import com.noodleverse.entity.*;
import com.noodleverse.exception.BadRequestException;
import com.noodleverse.exception.ResourceNotFoundException;
import com.noodleverse.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final ProductService productService;
    private final AuthService authService;

    public OrderService(OrderRepository orderRepository,
                        CartService cartService,
                        ProductService productService,
                        AuthService authService) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.productService = productService;
        this.authService = authService;
    }

    public OrderDto placeOrder(Long userId, OrderRequest request) {
        User user = authService.getUserById(userId);
        Cart cart = cartService.getOrCreateCart(userId);

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty. Please add noodles to place an order.");
        }

        // Validate and reduce stock for all items
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for " + product.getName() +
                        ". Available: " + product.getStock() + ", in cart: " + item.getQuantity());
            }
        }

        // Deduct stock
        for (CartItem item : cart.getItems()) {
            productService.updateStock(item.getProduct().getId(), -item.getQuantity());
        }

        // Create Order
        Order order = new Order();
        order.setOrderNumber(String.valueOf(1000 + new Random().nextInt(9000)));
        order.setUser(user);
        order.setPickupLocation(request.getPickupLocation());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus("PLACED");
        order.setMinimalPackaging(request.getMinimalPackaging() != null && request.getMinimalPackaging());
        order.setCreatedAt(LocalDateTime.now());
        order.setDeliveryFee(BigDecimal.ZERO);

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setProductName(cartItem.getProduct().getName());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setCountry(cartItem.getProduct().getCountry());
            orderItem.setCuisine(cartItem.getProduct().getCuisine());
            orderItem.setDietType(cartItem.getProduct().getDietType());
            orderItem.setCustomDetails(cartItem.getCustomDetails());

            order.addItem(orderItem);

            BigDecimal itemTotal = cartItem.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        order.setSubtotal(subtotal);
        order.setTotal(subtotal.add(order.getDeliveryFee()));

        Order saved = orderRepository.save(order);

        // Clear cart after placing order
        cartService.clearCart(userId);

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrders(Long userId) {
        User user = authService.getUserById(userId);
        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        List<OrderDto> dtos = new ArrayList<>();
        for (Order order : orders) {
            dtos.add(mapToDto(order));
        }
        return dtos;
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Order does not belong to the authenticated user");
        }

        return mapToDto(order);
    }

    private OrderDto mapToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setSubtotal(order.getSubtotal());
        dto.setDeliveryFee(order.getDeliveryFee());
        dto.setTotal(order.getTotal());
        dto.setPickupLocation(order.getPickupLocation());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setStatus(order.getStatus());
        dto.setMinimalPackaging(order.getMinimalPackaging());
        dto.setCreatedAt(order.getCreatedAt());

        List<OrderItemDto> itemDtos = new ArrayList<>();
        for (OrderItem item : order.getItems()) {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setId(item.getId());
            itemDto.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
            itemDto.setProductName(item.getProductName());
            itemDto.setPrice(item.getPrice());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setSubtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            itemDto.setCountry(item.getCountry());
            itemDto.setCountryFlag(getCountryFlag(item.getCountry()));
            itemDto.setCuisine(item.getCuisine());
            itemDto.setDietType(item.getDietType());
            itemDto.setCustomDetails(item.getCustomDetails());
            itemDtos.add(itemDto);
        }

        dto.setItems(itemDtos);
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
