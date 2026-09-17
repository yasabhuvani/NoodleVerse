package com.noodleverse.controller;

import com.noodleverse.dto.ProductDto;
import com.noodleverse.entity.Product;
import com.noodleverse.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) String noodleType,
            @RequestParam(required = false) String dietType,
            @RequestParam(required = false) String spiceLevel) {
        List<Product> products = productService.getAllProducts(search, cuisine, noodleType, dietType, spiceLevel);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductDto dto) {
        Product created = productService.createProduct(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
