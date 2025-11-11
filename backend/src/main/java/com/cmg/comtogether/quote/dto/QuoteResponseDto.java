package com.cmg.comtogether.quote.dto;

import com.cmg.comtogether.quote.entity.Quote;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuoteResponseDto {
    private Long quoteId;
    private List<QuoteItemResponseDto> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer totalPrice;
    private Integer itemCount;

    public static QuoteResponseDto from(Quote quote) {
        List<QuoteItemResponseDto> items = quote.getItems().stream()
                .map(QuoteItemResponseDto::from)
                .collect(Collectors.toList());

        Integer totalPrice = items.stream()
                .map(QuoteItemResponseDto::getLprice)
                .filter(price -> price != null)
                .reduce(0, Integer::sum);

        return QuoteResponseDto.builder()
                .quoteId(quote.getQuoteId())
                .items(items)
                .createdAt(quote.getCreatedAt())
                .updatedAt(quote.getUpdatedAt())
                .totalPrice(totalPrice)
                .itemCount(items.size())
                .build();
    }
}

