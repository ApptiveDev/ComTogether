package com.cmg.comtogether.quote.controller;

import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.common.security.CustomUserDetails;
import com.cmg.comtogether.quote.dto.AddQuoteItemRequestDto;
import com.cmg.comtogether.quote.dto.QuoteItemResponseDto;
import com.cmg.comtogether.quote.dto.QuoteResponseDto;
import com.cmg.comtogether.quote.dto.QuoteSummaryDto;
import com.cmg.comtogether.quote.dto.SaveQuoteRequestDto;
import com.cmg.comtogether.quote.dto.UpdateQuoteItemQuantityRequestDto;
import com.cmg.comtogether.quote.service.QuoteService;
import com.cmg.comtogether.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/quotes")
@RequiredArgsConstructor
public class QuoteController {

    private final QuoteService quoteService;

    /**
     * 새 견적 생성 (초안 상태)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<QuoteResponseDto>> createQuote(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = userDetails.getUser();
        QuoteResponseDto responseDto = quoteService.createQuote(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    /**
     * 저장된 견적 목록 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<QuoteSummaryDto>>> getQuotes(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = userDetails.getUser();
        List<QuoteSummaryDto> response = quoteService.getSavedQuotes(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 저장된 견적 단건 조회
     */
    @GetMapping("/{quoteId:\\d+}")
    public ResponseEntity<ApiResponse<QuoteResponseDto>> getQuote(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long quoteId
    ) {
        User user = userDetails.getUser();
        QuoteResponseDto responseDto = quoteService.getQuote(user.getUserId(), quoteId);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    /**
     * 견적에 상품 추가
     */
    @PostMapping("/{quoteId:\\d+}/items")
    public ResponseEntity<ApiResponse<QuoteItemResponseDto>> addItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long quoteId,
            @Valid @RequestBody AddQuoteItemRequestDto requestDto
    ) {
        User user = userDetails.getUser();
        QuoteItemResponseDto responseDto = quoteService.addItem(user.getUserId(), quoteId, requestDto);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    /**
     * 견적 상품 수량 수정
     */
    @PatchMapping("/{quoteId:\\d+}/items/{quoteItemId}")
    public ResponseEntity<ApiResponse<QuoteItemResponseDto>> updateItemQuantity(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long quoteId,
            @PathVariable Long quoteItemId,
            @Valid @RequestBody UpdateQuoteItemQuantityRequestDto requestDto
    ) {
        User user = userDetails.getUser();
        QuoteItemResponseDto responseDto = quoteService.updateItemQuantity(user.getUserId(), quoteId, quoteItemId, requestDto.getQuantity());
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    /**
     * 견적 저장 (이름 지정 필수)
     */
    @PutMapping("/{quoteId:\\d+}")
    public ResponseEntity<ApiResponse<QuoteResponseDto>> saveQuote(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long quoteId,
            @Valid @RequestBody SaveQuoteRequestDto requestDto
    ) {
        User user = userDetails.getUser();
        QuoteResponseDto responseDto = quoteService.saveQuote(user.getUserId(), quoteId, requestDto.getName());
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    /**
     * 견적에서 특정 상품 삭제
     */
    @DeleteMapping("/{quoteId:\\d+}/items/{quoteItemId}")
    public ResponseEntity<ApiResponse<QuoteResponseDto>> removeItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long quoteId,
            @PathVariable Long quoteItemId
    ) {
        User user = userDetails.getUser();
        QuoteResponseDto responseDto = quoteService.removeItem(user.getUserId(), quoteId, quoteItemId);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    /**
     * 견적의 모든 상품 삭제
     */
    @DeleteMapping("/{quoteId:\\d+}/items")
    public ResponseEntity<ApiResponse<QuoteResponseDto>> clearQuote(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long quoteId
    ) {
        User user = userDetails.getUser();
        QuoteResponseDto responseDto = quoteService.clearQuote(user.getUserId(), quoteId);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    /**
     * 견적 삭제
     */
    @DeleteMapping("/{quoteId:\\d+}")
    public ResponseEntity<ApiResponse<Void>> deleteQuote(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long quoteId
    ) {
        User user = userDetails.getUser();
        quoteService.deleteQuote(user.getUserId(), quoteId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
