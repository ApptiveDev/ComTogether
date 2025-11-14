package com.cmg.comtogether.searchhistory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchHistory {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String keyword;

    @Column(nullable = false)
    private LocalDateTime searchedAt;

    public void updateSearchedAt(LocalDateTime now) {
        searchedAt = now;
    }
}
