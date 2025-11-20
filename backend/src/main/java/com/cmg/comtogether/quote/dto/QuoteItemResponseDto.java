package com.cmg.comtogether.quote.dto;

import com.cmg.comtogether.quote.entity.QuoteItem;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuoteItemResponseDto {
    @JsonProperty("product_id")
    private Long productId;
    private String title;
    private Integer lprice;
    private Integer hprice;
    private String image;
    private String link;
    @JsonProperty("mall_name")
    private String mallName;
    @JsonProperty("product_type")
    private String productType;
    private String brand;
    @JsonProperty("category1")
    private String category1;
    @JsonProperty("category2")
    private String category2;
    @JsonProperty("category3")
    private String category3; // 견적 카테고리로 활용 (예: CPU, 메모리 등)
    @JsonProperty("category4")
    private String category4;

    private LocalDateTime createdAt;

    public static QuoteItemResponseDto from(QuoteItem quoteItem) {
        return QuoteItemResponseDto.builder()
                .productId(quoteItem.getProductId())
                .title(quoteItem.getTitle())
                .lprice(quoteItem.getLprice())
                .hprice(quoteItem.getHprice())
                .image(quoteItem.getImage())
                .link(quoteItem.getLink())
                .mallName(quoteItem.getMallName())
                .productType(quoteItem.getProductType())
                .brand(quoteItem.getBrand())
                .category1(quoteItem.getCategory1())
                .category2(quoteItem.getCategory2())
                .category3(quoteItem.getCategory3())
                .category4(quoteItem.getCategory4())
                .createdAt(quoteItem.getCreatedAt())
                .build();
    }
}

