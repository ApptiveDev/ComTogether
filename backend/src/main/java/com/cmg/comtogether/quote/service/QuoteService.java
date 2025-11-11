package com.cmg.comtogether.quote.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.quote.dto.AddQuoteItemRequestDto;
import com.cmg.comtogether.quote.dto.QuoteResponseDto;
import com.cmg.comtogether.quote.entity.Quote;
import com.cmg.comtogether.quote.entity.QuoteItem;
import com.cmg.comtogether.quote.repository.QuoteItemRepository;
import com.cmg.comtogether.quote.repository.QuoteRepository;
import com.cmg.comtogether.user.entity.User;
import com.cmg.comtogether.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final QuoteItemRepository quoteItemRepository;
    private final UserRepository userRepository;

    /**
     * 사용자의 현재 견적 조회 (가장 최근 업데이트된 견적)
     */
    public QuoteResponseDto getCurrentQuote(Long userId) {
        List<Quote> quotes = quoteRepository.findByUserUserIdOrderByUpdatedAtDesc(userId);
        
        if (quotes.isEmpty()) {
            // 견적이 없으면 빈 견적 생성
            return createEmptyQuote(userId);
        }
        
        Quote currentQuote = quotes.get(0);
        return QuoteResponseDto.from(currentQuote);
    }

    /**
     * 상품을 견적에 추가
     * 견적이 없으면 자동으로 생성
     */
    @Transactional
    public QuoteResponseDto addItem(Long userId, AddQuoteItemRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 가장 최근 견적 가져오기
        List<Quote> quotes = quoteRepository.findByUserUserIdOrderByUpdatedAtDesc(userId);
        Quote quote;
        
        if (quotes.isEmpty()) {
            // 견적이 없으면 새로 생성
            quote = Quote.builder()
                    .user(user)
                    .build();
            quote = quoteRepository.save(quote);
        } else {
            quote = quotes.get(0);
        }

        // 상품 추가
        QuoteItem quoteItem = new QuoteItem(
                quote,
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
                requestDto.getCategory4(),
                requestDto.getCategory()
        );

        quote.addItem(quoteItem);
        quoteItemRepository.save(quoteItem);
        quoteRepository.save(quote);

        // 다시 조회하여 items 포함
        Quote savedQuote = quoteRepository.findByUserUserIdOrderByUpdatedAtDesc(userId).get(0);
        return QuoteResponseDto.from(savedQuote);
    }

    /**
     * 견적에서 상품 삭제
     */
    @Transactional
    public QuoteResponseDto removeItem(Long userId, Long quoteItemId) {
        QuoteItem quoteItem = quoteItemRepository.findById(quoteItemId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUOTE_ITEM_NOT_FOUND));

        Quote quote = quoteItem.getQuote();
        
        // 권한 확인
        if (!quote.getUser().getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.QUOTE_ACCESS_DENIED);
        }

        quote.removeItem(quoteItem);
        quoteItemRepository.delete(quoteItem);
        quoteRepository.save(quote);

        // 다시 조회하여 items 포함
        Quote savedQuote = quoteRepository.findByUserUserIdOrderByUpdatedAtDesc(userId).get(0);
        return QuoteResponseDto.from(savedQuote);
    }

    /**
     * 견적 전체 비우기 (모든 상품 삭제)
     */
    @Transactional
    public QuoteResponseDto clearQuote(Long userId) {
        List<Quote> quotes = quoteRepository.findByUserUserIdOrderByUpdatedAtDesc(userId);
        
        if (quotes.isEmpty()) {
            return createEmptyQuote(userId);
        }
        
        Quote quote = quotes.get(0);
        
        // 모든 상품 삭제 (orphanRemoval = true로 인해 자동 삭제됨)
        quote.getItems().clear();
        quoteRepository.save(quote);
        
        // 다시 조회하여 items 포함
        Quote savedQuote = quoteRepository.findByUserUserIdOrderByUpdatedAtDesc(userId).get(0);
        return QuoteResponseDto.from(savedQuote);
    }

    /**
     * 빈 견적 생성 (조회용)
     */
    @Transactional
    public QuoteResponseDto createEmptyQuote(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        
        Quote quote = Quote.builder()
                .user(user)
                .build();
        Quote savedQuote = quoteRepository.save(quote);
        return QuoteResponseDto.from(savedQuote);
    }
}
