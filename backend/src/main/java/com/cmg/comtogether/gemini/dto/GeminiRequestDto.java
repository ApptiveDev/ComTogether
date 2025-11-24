package com.cmg.comtogether.gemini.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeminiRequestDto {

    @NotBlank(message = "프롬프트는 필수입니다.")
    @Size(max = 10000, message = "프롬프트는 10000자 이하여야 합니다.")
    private String prompt;
}

