package com.cmg.comtogether.certification.service;

import com.cmg.comtogether.certification.repository.CertificationRepository;
import com.cmg.comtogether.certification.dto.CertificationResponseDto;
import com.cmg.comtogether.certification.entity.Certification;
import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.common.s3.service.S3Service;
import com.cmg.comtogether.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certificationRepository;
    private final UserService userService;
    private final S3Service s3Service;

    public CertificationResponseDto createCertification(Long userId, String fileKey) {
        String publicUrl = s3Service.getPublicUrl(fileKey);

        Certification cert = Certification.builder()
                .userId(userId)
                .fileKey(fileKey)
                .status(Certification.Status.PENDING)
                .requestedAt(LocalDateTime.now())
                .build();

        certificationRepository.save(cert);

        return CertificationResponseDto.fromEntity(cert, publicUrl);
    }

    public List<CertificationResponseDto> getCertifications(Long userId) {
        return certificationRepository.findAllByUserIdOrderByRequestedAtDesc(userId)
                .stream()
                .map(c -> CertificationResponseDto.fromEntity(
                        c,
                        s3Service.getPublicUrl(c.getFileKey())
                ))
                .toList();
    }

    public List<CertificationResponseDto> getAllCertifications() {
        return certificationRepository.findAllByOrderByRequestedAtDesc()
                .stream()
                .map(c -> CertificationResponseDto.fromEntity(
                c,
                s3Service.getPublicUrl(c.getFileKey())
        ))
                .toList();
    }

    @Transactional
    public CertificationResponseDto approveCertification(Long certId) {
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CERTIFICATION_NOT_FOUND));
        cert.approve();
        userService.updateRoleToExpert(cert.getUserId());
        String publicUrl = s3Service.getPublicUrl(cert.getFileKey());

        return CertificationResponseDto.fromEntity(cert, publicUrl);
    }

    @Transactional
    public CertificationResponseDto rejectCertification(Long certId, String reason) {
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CERTIFICATION_NOT_FOUND));
        cert.reject(reason);
        String publicUrl = s3Service.getPublicUrl(cert.getFileKey());

        return CertificationResponseDto.fromEntity(cert, publicUrl);
    }

    @Transactional
    public void deleteCertification(Long certificationId, Long userId) {
        Certification c = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CERTIFICATION_NOT_FOUND));

        if (!c.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.CERTIFICATION_ACCESS_DENIED);
        }

        if (c.getFileKey() != null) {
            s3Service.deleteObject(c.getFileKey());
        }

        certificationRepository.delete(c);
    }
}
