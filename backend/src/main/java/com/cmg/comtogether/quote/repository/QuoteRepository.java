package com.cmg.comtogether.quote.repository;

import com.cmg.comtogether.quote.entity.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, Long> {
    
    @Query("select q from Quote q " +
            "left join fetch q.items " +
            "where q.user.userId = :userId " +
            "order by q.updatedAt desc")
    List<Quote> findByUserUserIdOrderByUpdatedAtDesc(@Param("userId") Long userId);
}

