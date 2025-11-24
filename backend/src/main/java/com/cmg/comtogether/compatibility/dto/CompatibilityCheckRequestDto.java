package com.cmg.comtogether.compatibility.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CompatibilityCheckRequestDto {

    @NotEmpty(message = "견적 아이템 목록은 필수입니다.")
    private List<CompatibilityItemDto> items;
}

