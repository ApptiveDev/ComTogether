package com.cmg.comtogether.searchhistory.controller;

import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.common.security.CustomUserDetails;
import com.cmg.comtogether.searchhistory.dto.SearchHistoryResponseDto;
import com.cmg.comtogether.searchhistory.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class SearchHistoryController {

    private final SearchHistoryService searchHistoryService;

    @GetMapping("/glossary/history")
    public ResponseEntity<ApiResponse<SearchHistoryResponseDto>> getGlossaryHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam int size
    ) {
        SearchHistoryResponseDto responseDto = searchHistoryService.getRecentGlossaryHistory(userDetails.getUser().getUserId(), size);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    @DeleteMapping("/glossary/history/{historyId}")
    public ResponseEntity<ApiResponse<Void>> deleteGlossaryHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long historyId
    ) {
        searchHistoryService.deleteSearchHistory(userDetails.getUser().getUserId(), historyId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
