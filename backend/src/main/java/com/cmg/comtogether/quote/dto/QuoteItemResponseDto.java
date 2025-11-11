package com.cmg.comtogether.quote.dto;

import com.cmg.comtogether.quote.entity.QuoteItem;
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
    private Long quoteItemId;
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
    // 네이버 쇼핑 카테고리(대분류~세분류)
    private String category1;
    private String category2;
    private String category3;
    private String category4;
    // 견적 슬롯 구분용 카테고리 (CPU, 메모리 등)
    private String category;
    private LocalDateTime createdAt;

    public static QuoteItemResponseDto from(QuoteItem quoteItem) {
        return QuoteItemResponseDto.builder()
                .quoteItemId(quoteItem.getQuoteItemId())
                .productId(quoteItem.getProductId())
                .title(quoteItem.getTitle())
                .lprice(quoteItem.getLprice())
                .hprice(quoteItem.getHprice())
                .image(quoteItem.getImage())
                .link(quoteItem.getLink())
                .mallName(quoteItem.getMallName())
                .productType(quoteItem.getProductType())
                .maker(quoteItem.getMaker())
                .brand(quoteItem.getBrand())
                .category1(quoteItem.getCategory1())
                .category2(quoteItem.getCategory2())
                .category3(quoteItem.getCategory3())
                .category4(quoteItem.getCategory4())
                .category(quoteItem.getCategory())
                .createdAt(quoteItem.getCreatedAt())
                .build();
    }
}

