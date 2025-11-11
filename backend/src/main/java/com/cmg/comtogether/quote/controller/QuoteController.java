package com.cmg.comtogether.quote.controller;

import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.common.security.CustomUserDetails;
import com.cmg.comtogether.quote.dto.AddQuoteItemRequestDto;
import com.cmg.comtogether.quote.dto.QuoteItemResponseDto;
import com.cmg.comtogether.quote.dto.QuoteResponseDto;
import com.cmg.comtogether.quote.service.QuoteService;
import com.cmg.comtogether.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/quotes")
@RequiredArgsConstructor
public class QuoteController {

    private final QuoteService quoteService;

    /**
     * 현재 견적 조회
     * GET /quotes
     */
    @GetMapping
    public ResponseEntity<ApiResponse<QuoteResponseDto>> getCurrentQuote(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = userDetails.getUser();
        QuoteResponseDto responseDto = quoteService.getCurrentQuote(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    /**
     * 견적에 상품 추가
     * POST /quotes/items
     */
    @PostMapping("/items")
    public ResponseEntity<ApiResponse<QuoteItemResponseDto>> addItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody AddQuoteItemRequestDto requestDto
    ) {
        User user = userDetails.getUser();
        QuoteItemResponseDto responseDto = quoteService.addItem(user.getUserId(), requestDto);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    /**
     * 견적에서 상품 삭제
     * DELETE /quotes/items/{quoteItemId}
     */
    @DeleteMapping("/items/{quoteItemId}")
    public ResponseEntity<ApiResponse<QuoteResponseDto>> removeItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long quoteItemId
    ) {
        User user = userDetails.getUser();
        QuoteResponseDto responseDto = quoteService.removeItem(user.getUserId(), quoteItemId);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    /**
     * 견적 전체 비우기
     * DELETE /quotes
     */
    @DeleteMapping
    public ResponseEntity<ApiResponse<QuoteResponseDto>> clearQuote(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = userDetails.getUser();
        QuoteResponseDto responseDto = quoteService.clearQuote(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }
}
