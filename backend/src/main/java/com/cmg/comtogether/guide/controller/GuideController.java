package com.cmg.comtogether.guide.controller;

import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.guide.dto.GuideResponseDto;
import com.cmg.comtogether.guide.service.GuideService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/guide")
public class GuideController {

    private final GuideService guideService;

    @GetMapping
    public ResponseEntity<ApiResponse<GuideResponseDto>> getGuide(@RequestParam @NotBlank(message = "카테고리는 필수입니다.") String category) {
        GuideResponseDto guideResponseDto = guideService.getGuide(category);
        return ResponseEntity.ok(ApiResponse.success(guideResponseDto));
    }
}
