package com.cmg.comtogether.gemini.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeminiResponseDto {

    private String prompt;
    private String response;
}

