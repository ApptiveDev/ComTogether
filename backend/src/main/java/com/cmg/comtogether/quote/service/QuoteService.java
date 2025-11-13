package com.cmg.comtogether.quote.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.quote.dto.AddQuoteItemRequestDto;
import com.cmg.comtogether.quote.dto.QuoteItemResponseDto;
import com.cmg.comtogether.quote.dto.QuoteResponseDto;
import com.cmg.comtogether.quote.dto.QuoteSummaryDto;
import com.cmg.comtogether.quote.entity.Quote;
import com.cmg.comtogether.quote.entity.QuoteItem;
import com.cmg.comtogether.quote.repository.QuoteItemRepository;
import com.cmg.comtogether.quote.repository.QuoteRepository;
import com.cmg.comtogether.user.entity.User;
import com.cmg.comtogether.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final QuoteItemRepository quoteItemRepository;
    private final UserRepository userRepository;

    /**
     * 새 견적 생성 (기존 미저장 견적 제거 후)
     */
    @Transactional
    public QuoteResponseDto createQuote(Long userId) {
        quoteRepository.deleteByUserUserIdAndSavedFalse(userId);
        return createEmptyQuote(userId);
    }

    @Transactional
    public QuoteItemResponseDto addItem(Long userId, Long quoteId, AddQuoteItemRequestDto requestDto) {
        Quote quote = quoteRepository.findByQuoteIdAndUserUserIdWithItems(quoteId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUOTE_NOT_FOUND));

        int quantityToAdd = requestDto.getQuantity() == null ? 1 : requestDto.getQuantity();

        QuoteItem quoteItem = quoteItemRepository.findByQuoteQuoteIdAndProductId(quoteId, requestDto.getProductId())
                .map(existing -> {
                    existing.increaseQuantity(quantityToAdd);
                    existing.updateDetails(
                            requestDto.getProductId(),
                            requestDto.getTitle(),
                            requestDto.getLprice(),
                            requestDto.getHprice(),
                            requestDto.getImage(),
                            requestDto.getLink(),
                            requestDto.getMallName(),
                            requestDto.getProductType(),
                            requestDto.getMaker(),
                            requestDto.getBrand(),
                            requestDto.getCategory1(),
                            requestDto.getCategory2(),
                            requestDto.getCategory3(),
                            requestDto.getCategory4()
                    );
                    QuoteItem savedItem = quoteItemRepository.save(existing);
                    quoteRepository.save(existing.getQuote());
                    return savedItem;
                })
                .orElseGet(() -> {
                    QuoteItem newItem = QuoteItem.builder()
                            .quote(quote)
                            .productId(requestDto.getProductId())
                            .title(requestDto.getTitle())
                            .lprice(requestDto.getLprice())
                            .hprice(requestDto.getHprice())
                            .image(requestDto.getImage())
                            .link(requestDto.getLink())
                            .mallName(requestDto.getMallName())
                            .productType(requestDto.getProductType())
                            .maker(requestDto.getMaker())
                            .brand(requestDto.getBrand())
                            .category1(requestDto.getCategory1())
                            .category2(requestDto.getCategory2())
                            .category3(requestDto.getCategory3())
                            .category4(requestDto.getCategory4())
                            .quantity(quantityToAdd)
                            .build();
                    quote.addItem(newItem);
                    QuoteItem savedItem = quoteItemRepository.save(newItem);
                    quoteRepository.save(quote);
                    return savedItem;
                });

        return QuoteItemResponseDto.from(quoteItem);
    }

    @Transactional(readOnly = true)
    public QuoteResponseDto getQuote(Long userId, Long quoteId) {
        Quote quote = quoteRepository.findByQuoteIdAndUserUserIdWithItems(quoteId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUOTE_NOT_FOUND));
        if (!quote.isSaved()) {
            throw new BusinessException(ErrorCode.QUOTE_NOT_FOUND);
        }
        return QuoteResponseDto.from(quote);
    }

    @Transactional(readOnly = true)
    public List<QuoteSummaryDto> getSavedQuotes(Long userId) {
        List<Quote> quotes = quoteRepository.findAllByUserUserIdAndSavedTrueOrderByCreatedAtDesc(userId);
        return quotes.stream()
                .map(QuoteSummaryDto::from)
                .toList();
    }

    @Transactional
    public QuoteResponseDto saveQuote(Long userId, Long quoteId, String name) {
        Quote quote = quoteRepository.findByQuoteIdAndUserUserIdWithItems(quoteId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUOTE_NOT_FOUND));

        if (!StringUtils.hasText(name)) {
            throw new BusinessException(ErrorCode.QUOTE_NAME_REQUIRED);
        }

        quote.markSaved(name);
        Quote savedQuote = quoteRepository.save(quote);
        return QuoteResponseDto.from(savedQuote);
    }

    @Transactional
    public void deleteQuote(Long userId, Long quoteId) {
        Quote quote = quoteRepository.findByQuoteIdAndUserUserIdWithItems(quoteId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUOTE_NOT_FOUND));
        quoteRepository.delete(quote);
    }

    /**
     * 견적에서 상품 삭제
     */
    @Transactional
    public QuoteResponseDto removeItem(Long userId, Long quoteId, Long quoteItemId) {
        QuoteItem quoteItem = quoteItemRepository.findById(quoteItemId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUOTE_ITEM_NOT_FOUND));

        Quote quote = quoteItem.getQuote();

        // 권한 확인
        if (!quote.getUser().getUserId().equals(userId) || !quote.getQuoteId().equals(quoteId)) {
            throw new BusinessException(ErrorCode.QUOTE_ACCESS_DENIED);
        }

        quote.removeItem(quoteItem);
        quoteItemRepository.delete(quoteItem);

        Quote savedQuote = quoteRepository.findByQuoteIdAndUserUserIdWithItems(quoteId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUOTE_NOT_FOUND));
        return QuoteResponseDto.from(savedQuote);
    }

    @Transactional
    public QuoteItemResponseDto updateItemQuantity(Long userId, Long quoteId, Long quoteItemId, Integer quantity) {
        QuoteItem quoteItem = quoteItemRepository.findById(quoteItemId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUOTE_ITEM_NOT_FOUND));

        Quote quote = quoteItem.getQuote();

        if (!quote.getUser().getUserId().equals(userId) || !quote.getQuoteId().equals(quoteId)) {
            throw new BusinessException(ErrorCode.QUOTE_ACCESS_DENIED);
        }

        if (quantity == null || quantity <= 0) {
            quote.removeItem(quoteItem);
            quoteItemRepository.delete(quoteItem);
            quote.touch();
            quoteRepository.save(quote);
            return null;
        }

        quoteItem.setQuantity(quantity);
        QuoteItem savedItem = quoteItemRepository.save(quoteItem);
        quote.touch();
        quoteRepository.save(quote);

        return QuoteItemResponseDto.from(savedItem);
    }

    /**
     * 견적 전체 비우기 (모든 상품 삭제)
     */
    @Transactional
    public QuoteResponseDto clearQuote(Long userId, Long quoteId) {
        Quote quote = quoteRepository.findByQuoteIdAndUserUserIdWithItems(quoteId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUOTE_NOT_FOUND));

        quote.getItems().clear();
        quote.touch();
        Quote savedQuote = quoteRepository.save(quote);
        return QuoteResponseDto.from(savedQuote);
    }

    /**
     * 빈 견적 생성 (조회용)
     */
    private QuoteResponseDto createEmptyQuote(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Quote quote = Quote.builder()
                .user(user)
                .build();
        Quote savedQuote = quoteRepository.save(quote);
        return QuoteResponseDto.from(savedQuote);
    }
}
