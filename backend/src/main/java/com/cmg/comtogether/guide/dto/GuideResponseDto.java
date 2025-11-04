package com.cmg.comtogether.guide.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class GuideResponseDto {
    private String category;
    private Description description;
}
