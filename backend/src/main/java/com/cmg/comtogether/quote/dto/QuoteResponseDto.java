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
    private String name;
    private List<QuoteItemResponseDto> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer totalPrice; //최저가(lprice) 합계
    private Integer totalQuantity;

    public static QuoteResponseDto from(Quote quote) {
        List<QuoteItemResponseDto> items = quote.getItems().stream()
                .map(QuoteItemResponseDto::from)
                .collect(Collectors.toList());

        Integer totalPrice = quote.getItems().stream()
                .filter(item -> item.getLprice() != null)
                .map(item -> item.getLprice())
                .reduce(0, Integer::sum);

        Integer totalQuantity = quote.getItems().size();

        return QuoteResponseDto.builder()
                .quoteId(quote.getQuoteId())
                .name(quote.getName())
                .items(items)
                .createdAt(quote.getCreatedAt())
                .updatedAt(quote.getUpdatedAt())
                .totalPrice(totalPrice)
                .totalQuantity(totalQuantity)
                .build();
    }
}

