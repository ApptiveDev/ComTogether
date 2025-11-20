package com.cmg.comtogether.quote.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuoteRequestDto {

    @NotBlank(message = "견적서 이름은 필수입니다.")
    private String name;

    @NotEmpty(message = "견적 아이템 목록은 필수입니다.")
    @Valid
    private List<AddQuoteItemRequestDto> items;
}

