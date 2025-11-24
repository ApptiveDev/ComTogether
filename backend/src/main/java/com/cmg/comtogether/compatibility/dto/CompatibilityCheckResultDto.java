package com.cmg.comtogether.compatibility.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompatibilityCheckResultDto {

    @JsonProperty("check_id")
    private Integer checkId; // 1~10

    @JsonProperty("check_name")
    private String checkName; // 예: "CPU ↔ 메인보드 호환성"

    private String result; // "POSITIVE", "NEGATIVE", "UNKNOWN"

    private List<String> errors;

    private List<String> warnings;

    private String details;

    @JsonProperty("status")
    private String status; // "PENDING", "COMPLETED", "ERROR"
}

