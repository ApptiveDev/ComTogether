package com.cmg.comtogether.quote.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SaveQuoteRequestDto {

    @NotBlank(message = "견적서 이름은 필수입니다.")
    private String name;
}


