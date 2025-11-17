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

import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final S3Service s3Service;
    private final CertificationRepository certificationRepository;
    private final UserService userService;

    public String generateCertificationUploadUrl(Long userId, String fileName, String contentType) {
        String key = "certifications/" + userId + "/" + System.currentTimeMillis() + "_" + fileName;
        URL presignedUrl = s3Service.generatePresignedUrl(key, contentType);

        Certification certification = Certification.builder()
                .userId(userId)
                .fileKey(key)
                .fileUrl(presignedUrl.toString().split("\\?")[0])
                .status(Certification.Status.PENDING)
                .requestedAt(LocalDateTime.now())
                .build();

        certificationRepository.save(certification);

        return presignedUrl.toString();
    }

    public List<CertificationResponseDto> getCertifications(Long userId) {
        return certificationRepository.findAllByUserIdOrderByRequestedAtDesc(userId)
                .stream()
                .map(CertificationResponseDto::fromEntity)
                .toList();
    }

    public List<CertificationResponseDto> getAllCertifications() {
        return certificationRepository.findAllByOrderByRequestedAtDesc()
                .stream()
                .map(CertificationResponseDto::fromEntity)
                .toList();
    }

    @Transactional
    public CertificationResponseDto approveCertification(Long certId) {
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CERTIFICATION_NOT_FOUND));
        cert.approve();
        userService.updateRoleToExpert(cert.getUserId());

        return CertificationResponseDto.fromEntity(cert);
    }

    @Transactional
    public CertificationResponseDto rejectCertification(Long certId, String reason) {
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CERTIFICATION_NOT_FOUND));
        cert.reject(reason);
        return CertificationResponseDto.fromEntity(cert);
    }

    @Transactional
    public void deleteCertification(Long certificationId, Long userId) {
        Certification c = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CERTIFICATION_NOT_FOUND));

        if (!c.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        String key = c.getFileUrl().replace("https://comtogether.s3.ap-southeast-2.amazonaws.com/", "");
        s3Service.deleteObject(key);

        certificationRepository.delete(c);
    }
}
