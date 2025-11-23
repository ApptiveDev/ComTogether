package com.cmg.comtogether.certification.repository;

import com.cmg.comtogether.certification.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findAllByUserIdOrderByRequestedAtDesc(Long userId);
    List<Certification> findAllByOrderByRequestedAtDesc();
}

