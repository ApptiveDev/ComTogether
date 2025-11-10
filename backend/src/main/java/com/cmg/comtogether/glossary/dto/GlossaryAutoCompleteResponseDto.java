package com.cmg.comtogether.glossary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class GlossaryAutoCompleteResponseDto {
    List<String> suggestions;
}
