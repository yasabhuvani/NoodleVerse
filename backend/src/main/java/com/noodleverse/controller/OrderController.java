package com.noodleverse.controller;

import com.noodleverse.dto.OrderDto;
import com.noodleverse.dto.OrderRequest;
import com.noodleverse.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderDto> placeOrder(
            @RequestParam(defaultValue = "1") Long userId,
            @Valid @RequestBody OrderRequest request) {
        OrderDto order = orderService.placeOrder(userId, request);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getUserOrders(@RequestParam(defaultValue = "1") Long userId) {
        List<OrderDto> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long userId) {
        OrderDto order = orderService.getOrderById(id, userId);
        return ResponseEntity.ok(order);
    }
}
