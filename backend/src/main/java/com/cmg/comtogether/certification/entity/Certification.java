package com.cmg.comtogether.certification.entity;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
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
public class Certification {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long certId;

    private Long userId;

    private String fileKey;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String rejectionReason;

    private LocalDateTime requestedAt;

    public enum Status {
        PENDING, APPROVED, REJECTED
    }

    public void approve() {
        if (this.status == Status.APPROVED)
            throw new BusinessException(ErrorCode.CERTIFICATION_ALREADY_APPROVED);
        this.status = Status.APPROVED;
        this.rejectionReason = null;
    }

    public void reject(String reason) {
        if (this.status == Status.REJECTED)
            throw new BusinessException(ErrorCode.CERTIFICATION_ALREADY_REJECTED);
        this.status = Status.REJECTED;
        this.rejectionReason = reason;
    }
}

