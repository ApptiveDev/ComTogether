package com.cmg.comtogether.searchhistory.repository;

import com.cmg.comtogether.searchhistory.entity.SearchHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    List<SearchHistory> findByUserIdOrderBySearchedAtDesc(Long userId, Pageable pageable);

    Optional<SearchHistory> findByUserIdAndKeyword(Long userId, String keyword);

    @Modifying
    @Query(value = """
        DELETE FROM search_history 
        WHERE history_id = (
            SELECT id FROM (
                SELECT history_id AS id
                FROM search_history 
                WHERE user_id = :userId
                ORDER BY searched_at ASC
                LIMIT 1
            ) AS t
        )
    """, nativeQuery = true)
    void deleteOldestRecord(Long userId);

    Long countByUserId(Long userId);
}
