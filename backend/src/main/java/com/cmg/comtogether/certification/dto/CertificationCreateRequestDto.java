package com.cmg.comtogether.certification.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CertificationCreateRequestDto {

    @NotBlank
    @JsonProperty("file_key")
    private String fileKey;
}
