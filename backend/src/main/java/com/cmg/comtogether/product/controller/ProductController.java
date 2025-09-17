package com.cmg.comtogether.product.controller;

import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.product.dto.NaverProductResponseDto;
import com.cmg.comtogether.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<NaverProductResponseDto>> searchProducts(
            @RequestParam String category,
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "10") int display,
            @RequestParam(defaultValue = "1") int start,
            @RequestParam(defaultValue = "sim") String sort,
            @RequestParam(required = false) String exclude
    ) {
        NaverProductResponseDto responseDto = productService.searchProducts(category, query, display, start, sort, exclude);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }
}
