package com.cmg.comtogether.compatibility.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 호환성 체크 결과를 PDF로 변환할 때 사용하는 요청 DTO.
 * 재다운로드 없이 1회 변환을 위해 결과와 아이템을 그대로 받는다.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompatibilityPdfRequestDto {

    /**
     * PDF 제목 (선택)
     */
    private String title;

    /**
     * PDF에 표시할 검사 결과 목록 (필수)
     */
    @NotEmpty(message = "호환성 검사 결과는 필수입니다.")
    @Valid
    private List<CompatibilityCheckResultDto> results;

    /**
     * PDF에 표시할 아이템 목록 (선택)
     */
    @Valid
    private List<CompatibilityItemDto> items;
}
