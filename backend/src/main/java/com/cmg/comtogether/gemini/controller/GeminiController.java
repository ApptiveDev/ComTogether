package com.cmg.comtogether.gemini.controller;

import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.gemini.dto.GeminiRequestDto;
import com.cmg.comtogether.gemini.dto.GeminiResponseDto;
import com.cmg.comtogether.gemini.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/gemini")
@RequiredArgsConstructor
public class GeminiController {

    private final GeminiService geminiService;

    /**
     * Gemini API를 사용한 텍스트 생성
     */
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<GeminiResponseDto>> generateText(
            @Valid @RequestBody GeminiRequestDto requestDto
    ) {
        String prompt = requestDto.getPrompt();
        String response = geminiService.generateText(prompt);

        GeminiResponseDto responseDto = GeminiResponseDto.builder()
                .response(response)
                .prompt(prompt)
                .build();

        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }
}

