package com.cmg.comtogether.quote.dto;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateQuoteItemQuantityRequestDto {

    @Min(value = 0, message = "수량은 0 이상이어야 합니다.")
    private Integer quantity;
}


