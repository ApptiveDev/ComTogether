package com.cmg.comtogether.common.s3.controller;

import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.common.s3.dto.PresignedURLRequestDto;
import com.cmg.comtogether.common.s3.dto.PresignedUrlResponseDto;
import com.cmg.comtogether.common.s3.service.S3Service;
import com.cmg.comtogether.common.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URL;

@RestController
@RequiredArgsConstructor
@RequestMapping("/upload")
public class S3Controller {

    private final S3Service s3Service;

    @PostMapping("/presigned")
    public ResponseEntity<ApiResponse<PresignedUrlResponseDto>> getPresignedUrl(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody PresignedURLRequestDto requestDto
    ) {
        String fileKey = s3Service.generateKey(userDetails.getUser().getUserId(), requestDto);
        URL uploadUrl = s3Service.generatePresignedUrl(fileKey, requestDto.getContentType());
        String fileUrl = s3Service.getPublicUrl(fileKey);
        PresignedUrlResponseDto responseDto = PresignedUrlResponseDto.builder()
                .fileKey(fileKey)
                .fileUrl(fileUrl)
                .uploadUrl(uploadUrl.toString())
                .build();
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }
}
