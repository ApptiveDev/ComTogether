package com.cmg.comtogether.quote.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AddQuoteItemRequestDto {

    @NotNull(message = "상품 ID는 필수입니다.")
    private Long productId;

    @NotBlank(message = "상품명은 필수입니다.")
    private String title;

    @NotNull(message = "최저가는 필수입니다.")
    private Integer lprice;

    private Integer hprice;

    private String image;

    @NotBlank(message = "링크는 필수입니다.")
    private String link;

    @NotBlank(message = "몰명은 필수입니다.")
    private String mallName;

    private String productType;

    private String maker;

    private String brand;

    // 네이버 쇼핑 카테고리(대분류~세분류)
    private String category1;
    private String category2;
    private String category3;
    private String category4;

    // 견적 슬롯 구분용 카테고리 (CPU, 메모리 등 상단 탭)
    @NotBlank(message = "카테고리는 필수입니다.")
    private String category;
}

