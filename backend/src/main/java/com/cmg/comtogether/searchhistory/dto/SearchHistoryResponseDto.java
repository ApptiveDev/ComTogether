package com.cmg.comtogether.searchhistory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
@AllArgsConstructor
public class SearchHistoryResponseDto {
    List<SearchHistoryDto> histories;
}
