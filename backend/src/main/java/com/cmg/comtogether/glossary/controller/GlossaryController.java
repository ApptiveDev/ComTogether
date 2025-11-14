package com.cmg.comtogether.glossary.controller;

import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.common.security.CustomUserDetails;
import com.cmg.comtogether.glossary.dto.GlossaryAutoCompleteResponseDto;
import com.cmg.comtogether.glossary.dto.GlossaryDetailResponseDto;
import com.cmg.comtogether.glossary.service.GlossaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/glossary")
@RequiredArgsConstructor
public class GlossaryController {

    private final GlossaryService glossaryService;

    @GetMapping("/autocomplete")
    public ResponseEntity<ApiResponse<GlossaryAutoCompleteResponseDto>> autoComplete(
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int size
    ) {
        GlossaryAutoCompleteResponseDto autoComplete = glossaryService.getAutoComplete(query, size);
        return ResponseEntity.ok(ApiResponse.success(autoComplete));
    }

    @GetMapping("/detail")
    public ResponseEntity<ApiResponse<GlossaryDetailResponseDto>> getDetail(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestParam String query
    ) {
        GlossaryDetailResponseDto detail = glossaryService.getDetail(customUserDetails.getUser().getUserId(), query);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }
}
