package com.cmg.comtogether.certification.controller;

import com.cmg.comtogether.certification.dto.CertificationCreateRequestDto;
import com.cmg.comtogether.certification.dto.CertificationResponseDto;
import com.cmg.comtogether.certification.service.CertificationService;
import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.common.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certification")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certificationService;

    @PostMapping
    public ResponseEntity<ApiResponse<CertificationResponseDto>> createCertification(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody CertificationCreateRequestDto requestDto
    ) {
        CertificationResponseDto responseDto = certificationService.createCertification(userDetails.getUser().getUserId(), requestDto.getFileKey());
        return ResponseEntity.ok(ApiResponse.success(responseDto));
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
