package com.cmg.comtogether.searchhistory.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.searchhistory.dto.SearchHistoryDto;
import com.cmg.comtogether.searchhistory.dto.SearchHistoryResponseDto;
import com.cmg.comtogether.searchhistory.entity.SearchHistory;
import com.cmg.comtogether.searchhistory.repository.SearchHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SearchHistoryService {

    private final SearchHistoryRepository searchHistoryRepository;

    public SearchHistoryResponseDto getRecentGlossaryHistory(Long userId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<SearchHistory> searchHistories = searchHistoryRepository.findByUserIdOrderBySearchedAtDesc(userId, pageable);

        List<SearchHistoryDto> dtoList = searchHistories.stream()
                .map(sh -> SearchHistoryDto.builder()
                        .historyId(sh.getHistoryId())
                        .keyword(sh.getKeyword())
                        .build())
                .toList();

        return SearchHistoryResponseDto.builder()
                .histories(dtoList)
                .build();
    }

    @Transactional
    public void saveSearchHistory(Long userId, String keyword) {

        Long count = searchHistoryRepository.countByUserId(userId);
        if (count >= 30) {
            searchHistoryRepository.deleteOldestRecord(userId);
        }

        Optional<SearchHistory> exists =
                searchHistoryRepository.findByUserIdAndKeyword(userId, keyword);

        if (exists.isPresent()) {
            SearchHistory history = exists.get();
            history.updateSearchedAt(LocalDateTime.now());
        } else {
            SearchHistory newHistory = SearchHistory.builder()
                    .userId(userId)
                    .keyword(keyword)
                    .searchedAt(LocalDateTime.now())
                    .build();
            searchHistoryRepository.save(newHistory);
        }
    }

    public void deleteSearchHistory(Long userId, Long historyId) {
        SearchHistory history = searchHistoryRepository.findById(historyId)
                .orElseThrow(() -> new BusinessException(ErrorCode.HISTORY_NOT_FOUND));

        if (!history.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.HISTORY_ACCESS_DENIED);
        }

        searchHistoryRepository.deleteById(historyId);
    }
}
