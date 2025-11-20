package com.cmg.comtogether.quote.controller;

import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.common.security.CustomUserDetails;
import com.cmg.comtogether.quote.dto.CreateQuoteRequestDto;
import com.cmg.comtogether.quote.dto.QuoteResponseDto;
import com.cmg.comtogether.quote.dto.QuoteSummaryDto;
import com.cmg.comtogether.quote.dto.UpdateQuoteRequestDto;
import com.cmg.comtogether.quote.service.QuoteService;
import com.cmg.comtogether.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
     * 새 견적 생성 (최종 저장)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<QuoteResponseDto>> createQuote(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateQuoteRequestDto requestDto
    ) {
        User user = userDetails.getUser();
        QuoteResponseDto responseDto = quoteService.createQuote(user.getUserId(), requestDto);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    /**
     * 견적 목록 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<QuoteSummaryDto>>> getQuotes(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = userDetails.getUser();
        List<QuoteSummaryDto> response = quoteService.getAllQuotes(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 견적 단건 조회
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
     * 견적 수정 (전체 수정)
     */
    @PutMapping("/{quoteId:\\d+}")
    public ResponseEntity<ApiResponse<QuoteResponseDto>> updateQuote(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long quoteId,
            @Valid @RequestBody UpdateQuoteRequestDto requestDto
    ) {
        User user = userDetails.getUser();
        QuoteResponseDto responseDto = quoteService.updateQuote(user.getUserId(), quoteId, requestDto);
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
