package com.cmg.comtogether.quote.dto;

import com.cmg.comtogether.quote.entity.Quote;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuoteSummaryDto {

    private Long quoteId;
    private String name;
    private boolean saved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer itemCount;
    private Integer totalPrice;

    public static QuoteSummaryDto from(Quote quote) {
        int itemCount = quote.getItems() != null ? quote.getItems().size() : 0;
        int totalPrice = quote.getItems() == null ? 0 :
                quote.getItems().stream()
                        .map(item -> item.getLprice() == null ? 0 : item.getLprice())
                        .reduce(0, Integer::sum);

        return QuoteSummaryDto.builder()
                .quoteId(quote.getQuoteId())
                .name(quote.getName())
                .saved(quote.isSaved())
                .createdAt(quote.getCreatedAt())
                .updatedAt(quote.getUpdatedAt())
                .itemCount(itemCount)
                .totalPrice(totalPrice)
                .build();
    }
}


