package com.cmg.comtogether.glossary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class GlossaryDetailResponseDto {
    private String name;
    private String description;
}
