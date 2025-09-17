package com.cmg.comtogether.product.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NaverProductResponseDto {
    private int total;
    private int start;
    private int display;
    private List<NaverProductDto> items;
}
