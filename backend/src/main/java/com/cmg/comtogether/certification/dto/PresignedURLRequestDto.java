package com.cmg.comtogether.certification.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PresignedURLRequestDto {

    @NotBlank(message = "파일 이름은 필수 입니다.")
    @JsonProperty("file_name")
    String fileName;

    @NotBlank(message = "Content-Type은 필수 입니다.")
    @JsonProperty("content_type")
    String contentType;
}
