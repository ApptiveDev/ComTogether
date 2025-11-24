package com.cmg.comtogether.common.s3.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PresignedUrlResponseDto {

    private String fileKey;

    private String fileUrl;

    private String uploadUrl;
}
