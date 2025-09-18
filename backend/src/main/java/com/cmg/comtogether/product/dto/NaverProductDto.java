package com.cmg.comtogether.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NaverProductDto {
    private Long productId;
    private String title;
    private Integer lprice;
    private Integer hprice;
    private String image;
    private String link;
    private String mallName;
    private String productType;
    private String maker;
    private String brand;
    private String category1;
    private String category2;
    private String category3;
    private String category4;
}
