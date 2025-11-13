package com.cmg.comtogether.quote.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
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
    @JsonProperty("product_id")
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
    @JsonProperty("mall_name")
    private String mallName;

    @JsonProperty("product_type")
    private String productType;

    private String maker;

    private String brand;

    // 네이버 쇼핑 카테고리(대분류~세분류)
    @JsonProperty("category1")
    private String category1;
    @JsonProperty("category2")
    private String category2;
    @JsonProperty("category3")
    private String category3;
    @JsonProperty("category4")
    private String category4;

    @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
    private Integer quantity = 1;
}

