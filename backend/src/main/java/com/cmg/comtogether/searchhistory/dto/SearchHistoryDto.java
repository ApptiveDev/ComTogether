package com.cmg.comtogether.searchhistory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SearchHistoryDto {
    private Long historyId;
    private String keyword;
}
