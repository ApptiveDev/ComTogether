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
    private Long certId;
    private Long userId;
    private String fileUrl;
    private String status;
    private LocalDateTime requestedAt;
    private String reason;

    public static CertificationResponseDto fromEntity(Certification cert, String publicUrl) {
        return CertificationResponseDto.builder()
                .certId(cert.getCertId())
                .userId(cert.getUserId())
                .fileUrl(publicUrl)
                .status(cert.getStatus().name())
                .requestedAt(cert.getRequestedAt())
                .build();
    }
}

