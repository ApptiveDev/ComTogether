package com.cmg.comtogether.common.s3.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class PresignedURLRequestDto {

    @NotBlank
    String type;

    @NotBlank
    private String extension;

    @NotBlank
    @JsonProperty("content_type")
    String contentType;
}
