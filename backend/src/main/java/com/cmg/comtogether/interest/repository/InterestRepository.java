package com.cmg.comtogether.interest.repository;

import com.cmg.comtogether.interest.entity.Interest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterestRepository extends JpaRepository<Interest, Long> {
    List<Interest> findByIsCustomFalse();
}
