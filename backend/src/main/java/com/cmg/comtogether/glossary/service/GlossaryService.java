package com.cmg.comtogether.glossary.service;

import co.elastic.clients.elasticsearch._types.query_dsl.*;
import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.glossary.dto.GlossaryAutoCompleteResponseDto;
import com.cmg.comtogether.glossary.dto.GlossaryDetailResponseDto;
import com.cmg.comtogether.glossary.entity.GlossaryDocument;
import com.cmg.comtogether.searchhistory.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GlossaryService {

    private final ElasticsearchOperations elasticsearchOperations;
    private final SearchHistoryService searchHistoryService;

    public GlossaryAutoCompleteResponseDto  getAutoComplete(String query, int size) {
        Query autoComplete = MultiMatchQuery.of(m -> m
                .query(query)
                .type(TextQueryType.BoolPrefix)
                .fields("name.auto_complete", "name.auto_complete._2gram", "name.auto_complete._3gram")
        )._toQuery();

        Query synonymMath = MatchQuery.of(m -> m
                .field("name")
                .query(query)
        )._toQuery();

        Query combined = BoolQuery.of(b -> b
                .should(autoComplete)
                .should(synonymMath)
        )._toQuery();

        NativeQuery queryObj = NativeQuery.builder()
                .withQuery(combined)
                .withPageable(PageRequest.of(0, size))
                .build();

        SearchHits<GlossaryDocument> hits = elasticsearchOperations.search(queryObj, GlossaryDocument.class);
        return GlossaryAutoCompleteResponseDto.builder()
                .suggestions(
                        hits.getSearchHits().stream()
                                .map(SearchHit::getContent)
                                .map(GlossaryDocument::getName)
                                .distinct()
                                .toList()
                ).build();
    }

    @Transactional
    public GlossaryDetailResponseDto getDetail(Long userId, String query) {
        searchHistoryService.saveSearchHistory(userId, query);

        Query q = TermQuery.of(t -> t
                .field("name.raw")
                .value(query)
        )._toQuery();

        NativeQuery queryObj = NativeQuery.builder()
                .withQuery(q)
                .build();

        SearchHits<GlossaryDocument> hits = elasticsearchOperations.search(queryObj, GlossaryDocument.class);

        GlossaryDocument doc = hits.getSearchHits().stream()
                .findFirst()
                .map(SearchHit::getContent)
                .orElseThrow(() -> new BusinessException(ErrorCode.WORD_NOT_FOUND));

        return GlossaryDetailResponseDto.builder()
                .name(doc.getName())
                .description(doc.getDescription())
                .build();
    }
}
