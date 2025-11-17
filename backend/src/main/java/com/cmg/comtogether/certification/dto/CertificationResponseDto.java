package com.cmg.comtogether.certification.dto;

import com.cmg.comtogether.certification.entity.Certification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class CertificationResponseDto {
    private Long id;
    private Long userId;
    private String fileUrl;
    private String status;
    private LocalDateTime requestedAt;
    private String reason;

    public static CertificationResponseDto fromEntity(Certification cert) {
        return CertificationResponseDto.builder()
                .id(cert.getId())
                .userId(cert.getUserId())
                .fileUrl(cert.getFileUrl())
                .status(cert.getStatus().name())
                .requestedAt(cert.getRequestedAt())
                .build();
    }
}

