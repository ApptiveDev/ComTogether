package com.cmg.comtogether.compatibility.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompatibilityItemDto {

    @NotBlank(message = "제품명은 필수입니다.")
    private String title;

    @JsonProperty("category3")
    private String category3; // 카테고리 (예: CPU, 메인보드, RAM 등)
}

