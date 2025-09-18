package com.cmg.comtogether.product.controller;

import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.product.dto.NaverProductResponseDto;
import com.cmg.comtogether.product.service.ProductService;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
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
    @Validated
    public ResponseEntity<ApiResponse<NaverProductResponseDto>> searchProducts(
            @RequestParam @NotBlank(message = "카테고리는 필수입니다.") String category,
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "10") @Min(1) int display,
            @RequestParam(defaultValue = "1") @Min(1) int start,
            @RequestParam(defaultValue = "sim") @Pattern(regexp = "sim|date|asc|dsc", message = "sort 값이 유효하지 않습니다.") String sort,
            @RequestParam(required = false) String exclude
    ) {
        NaverProductResponseDto responseDto = productService.searchProducts(category, query, display, start, sort, exclude);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }
}
