package com.cmg.comtogether.quote.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.quote.dto.AddQuoteItemRequestDto;
import com.cmg.comtogether.quote.dto.CreateQuoteRequestDto;
import com.cmg.comtogether.quote.dto.QuoteResponseDto;
import com.cmg.comtogether.quote.dto.UpdateQuoteRequestDto;
import com.cmg.comtogether.quote.dto.QuoteSummaryDto;
import com.cmg.comtogether.quote.entity.Quote;
import com.cmg.comtogether.quote.entity.QuoteItem;
import com.cmg.comtogether.quote.repository.QuoteRepository;
import com.cmg.comtogether.user.entity.User;
import com.cmg.comtogether.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final UserRepository userRepository;

    /**
     * 새 견적 생성 (최종 저장)
     */
    @Transactional
    public QuoteResponseDto createQuote(Long userId, CreateQuoteRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Quote quote = Quote.builder()
                .user(user)
                .name(requestDto.getName())
                .build();

        // 카테고리 중복 검증
        Set<String> categories = new HashSet<>();
        for (AddQuoteItemRequestDto itemDto : requestDto.getItems()) {
            String category = itemDto.getCategory3();
            if (category == null || category.trim().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }
            if (categories.contains(category)) {
                throw new BusinessException(ErrorCode.QUOTE_DUPLICATE_CATEGORY);
            }
            categories.add(category);
        }

        // 카테고리별 아이템 추가
        for (AddQuoteItemRequestDto itemDto : requestDto.getItems()) {
            QuoteItem quoteItem = QuoteItem.builder()
                    .quote(quote)
                    .productId(itemDto.getProductId())
                    .title(itemDto.getTitle())
                    .lprice(itemDto.getLprice())
                    .hprice(itemDto.getHprice())
                    .image(itemDto.getImage())
                    .link(itemDto.getLink())
                    .mallName(itemDto.getMallName())
                    .productType(itemDto.getProductType())
                    .maker(itemDto.getMaker())
                    .brand(itemDto.getBrand())
                    .category1(itemDto.getCategory1())
                    .category2(itemDto.getCategory2())
                    .category3(itemDto.getCategory3()) // category3 필드 사용
                    .category4(itemDto.getCategory4())
                    .build();
            quote.addItem(quoteItem);
        }

        Quote savedQuote = quoteRepository.save(quote);
        return QuoteResponseDto.from(savedQuote);
    }

    @Transactional(readOnly = true)
    public QuoteResponseDto getQuote(Long userId, Long quoteId) {
        Quote quote = quoteRepository.findByQuoteIdAndUserUserIdWithItems(quoteId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUOTE_NOT_FOUND));
        return QuoteResponseDto.from(quote);
    }

    @Transactional(readOnly = true)
    public List<QuoteSummaryDto> getAllQuotes(Long userId) {
        List<Quote> quotes = quoteRepository.findAllByUserUserIdOrderByCreatedAtDesc(userId);
        return quotes.stream()
                .map(QuoteSummaryDto::from)
                .toList();
    }

    /**
     * 견적 수정 (전체 수정)
     */
    @Transactional
    public QuoteResponseDto updateQuote(Long userId, Long quoteId, UpdateQuoteRequestDto requestDto) {
        Quote quote = quoteRepository.findByQuoteIdAndUserUserIdWithItems(quoteId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUOTE_NOT_FOUND));

        // 견적 이름 업데이트 (null이 아니고 비어있지 않으면 업데이트, 아니면 기존 이름 유지)
        if (requestDto.getName() != null && !requestDto.getName().trim().isEmpty()) {
            quote.updateName(requestDto.getName());
        }

        // 기존 아이템 모두 삭제 (orphanRemoval = true로 자동 삭제됨)
        quote.getItems().clear();

        // 카테고리 중복 검증
        Set<String> categories = new HashSet<>();
        for (AddQuoteItemRequestDto itemDto : requestDto.getItems()) {
            String category = itemDto.getCategory3();
            if (category == null || category.trim().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }
            if (categories.contains(category)) {
                throw new BusinessException(ErrorCode.QUOTE_DUPLICATE_CATEGORY);
            }
            categories.add(category);
        }

        // 새로운 아이템 추가
        for (AddQuoteItemRequestDto itemDto : requestDto.getItems()) {
            QuoteItem quoteItem = QuoteItem.builder()
                    .quote(quote)
                    .productId(itemDto.getProductId())
                    .title(itemDto.getTitle())
                    .lprice(itemDto.getLprice())
                    .hprice(itemDto.getHprice())
                    .image(itemDto.getImage())
                    .link(itemDto.getLink())
                    .mallName(itemDto.getMallName())
                    .productType(itemDto.getProductType())
                    .maker(itemDto.getMaker())
                    .brand(itemDto.getBrand())
                    .category1(itemDto.getCategory1())
                    .category2(itemDto.getCategory2())
                    .category3(itemDto.getCategory3()) // category3 필드 사용
                    .category4(itemDto.getCategory4())
                    .build();
            quote.addItem(quoteItem);
        }

        Quote savedQuote = quoteRepository.save(quote);
        return QuoteResponseDto.from(savedQuote);
    }

    @Transactional
    public void deleteQuote(Long userId, Long quoteId) {
        Quote quote = quoteRepository.findByQuoteIdAndUserUserIdWithItems(quoteId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUOTE_NOT_FOUND));
        quoteRepository.delete(quote);
    }
}
