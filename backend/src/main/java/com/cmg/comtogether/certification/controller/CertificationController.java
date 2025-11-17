package com.cmg.comtogether.certification.controller;

import com.cmg.comtogether.certification.dto.CertificationResponseDto;
import com.cmg.comtogether.certification.dto.PresignedURLRequestDto;
import com.cmg.comtogether.certification.service.CertificationService;
import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/certification")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certificationService;

    @PostMapping("/presigned-url")
    public ResponseEntity<ApiResponse<?>> generateUploadUrl(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody PresignedURLRequestDto requestDto
    ) {
        Long userId = userDetails.getUser().getUserId();
        String presignedUrl = certificationService.generateCertificationUploadUrl(userId, requestDto.getFileName(), requestDto.getContentType());

        return ResponseEntity.ok(ApiResponse.success(
                "전문가 인증 업로드 URL이 발급되었습니다 (10분 유효)",
                Map.of("presigned_url", presignedUrl)
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<CertificationResponseDto>>> getMyCertifications(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUser().getUserId();
        return ResponseEntity.ok(ApiResponse.success(
                certificationService.getCertifications(userId)
        ));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CertificationResponseDto>>> getAllCertifications() {
        return ResponseEntity.ok(ApiResponse.success(
                certificationService.getAllCertifications()
        ));
    }

    @PatchMapping("/{certId}/approve")
    public ResponseEntity<ApiResponse<Void>> approveCertification(@PathVariable Long certId) {
        certificationService.approveCertification(certId);
        return ResponseEntity.ok(ApiResponse.success("인증이 승인되었습니다.", null));
    }

    @PatchMapping("/{certId}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectCertification(
            @PathVariable Long certId,
            @RequestParam(required = false) String reason
    ) {
        certificationService.rejectCertification(certId, reason);
        return ResponseEntity.ok(ApiResponse.success("인증이 거절되었습니다.", null));
    }

    @DeleteMapping("/{certId}")
    public ApiResponse<Void> deleteCertification(
            @PathVariable Long certId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        certificationService.deleteCertification(certId, userDetails.getUser().getUserId());
        return ApiResponse.success(null);
    }
}
