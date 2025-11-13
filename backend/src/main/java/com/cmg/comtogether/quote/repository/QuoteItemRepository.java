package com.cmg.comtogether.quote.repository;

import com.cmg.comtogether.quote.entity.QuoteItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuoteItemRepository extends JpaRepository<QuoteItem, Long> {

    Optional<QuoteItem> findByQuoteQuoteIdAndProductId(Long quoteId, Long productId);
}
