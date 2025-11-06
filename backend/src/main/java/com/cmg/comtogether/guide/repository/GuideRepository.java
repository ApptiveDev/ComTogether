package com.cmg.comtogether.guide.repository;

import com.cmg.comtogether.guide.entity.Guide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GuideRepository extends JpaRepository<Guide, Long> {
    Optional<Guide> findByCategory(String category);
}
