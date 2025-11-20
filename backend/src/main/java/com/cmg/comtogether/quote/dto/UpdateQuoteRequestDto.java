package com.cmg.comtogether.quote.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateQuoteRequestDto {

    private String name; // 선택적: null이면 기존 이름 유지, 값이 있으면 업데이트

    @NotEmpty(message = "견적 아이템 목록은 필수입니다.")
    @Valid
    private List<AddQuoteItemRequestDto> items;
}

