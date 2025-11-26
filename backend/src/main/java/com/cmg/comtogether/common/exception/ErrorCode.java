package com.cmg.comtogether.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // 공통
    INVALID_INPUT(400, "COMMON-001", "잘못된 입력 값입니다."),
    INVALID_FORMAT(400, "COMMON-002", "요청 본문의 형식이 올바르지 않습니다."),
    METHOD_NOT_ALLOWED(405, "COMMON-003", "지원하지 않는 메서드입니다."),
    INTERNAL_SERVER_ERROR(500, "COMMON-999", "서버 에러가 발생했습니다."),

    // 유저
    USER_NOT_FOUND(404, "USER-001", "사용자를 찾을 수 없습니다."),

    // 인증/인가
    UNAUTHORIZED(401, "AUTH-001", "인증이 필요합니다."),
    TOKEN_EXPIRED(401, "AUTH-002", "토큰이 만료되었습니다."),
    INVALID_TOKEN(401, "AUTH-003", "유효하지 않은 토큰입니다."),
    FORBIDDEN(403, "AUTH-004", "접근 권한이 없습니다."),
    INVALID_PASSWORD(401, "AUTH-005", "비밀번호가 일치하지 않습니다."),

    // 카카오 API
    OAUTH_INVALID_CODE(400, "OAUTH-000", "유효하지 않은 인가 코드 또는 URI 입니다."),
    OAUTH_PROVIDER_ERROR(502, "OAUTH-999", "카카오 서버와 통신 중 오류가 발생했습니다."),

    // 네이버 상품 API
    NAVER_API_ERROR(502, "NAVER-999", "네이버 서버와 통신 중 오류가 발생했습니다."),
    
    // Gemini API
    GEMINI_API_ERROR(502, "GEMINI-999", "Gemini API와 통신 중 오류가 발생했습니다."),
    
    // 가이드
    GUIDE_NOT_FOUND(404, "GUIDE-001", "가이드를 찾을 수 없습니다"),

    // 용어사전
    WORD_NOT_FOUND(404, "GLOSSARY-001", "해당 용어를 찾을 수 없습니다."),

    // 견적
    QUOTE_NOT_FOUND(404, "QUOTE-001", "견적을 찾을 수 없습니다."),
    QUOTE_ITEM_NOT_FOUND(404, "QUOTE-002", "견적 항목을 찾을 수 없습니다."),
    QUOTE_ACCESS_DENIED(403, "QUOTE-003", "견적에 대한 접근 권한이 없습니다."),
    QUOTE_NAME_REQUIRED(400, "QUOTE-004", "견적 이름이 필요합니다."),
    QUOTE_DUPLICATE_CATEGORY(400, "QUOTE-005", "동일한 카테고리의 아이템이 중복되었습니다."),

    // 검색 기록
    HISTORY_NOT_FOUND(404, "HISTORY-001", "검색 기록을 찾을 수 없습니다."),
    HISTORY_ACCESS_DENIED(403, "HISTORY-002", "검색 기록에 대한 접근 권한이 없습니다."),

    // 전문가 인증
    CERTIFICATION_NOT_FOUND(404, "CERTIFICATION-001" , "해당 인증을 찾을 수 없습니다." ),
    CERTIFICATION_ALREADY_APPROVED(400, "CERTIFICATION-002", "이미 승인된 인증입니다."),
    CERTIFICATION_ALREADY_REJECTED(400, "CERTIFICATION-003", "이미 거절된 인증입니다."),
    CERTIFICATION_ACCESS_DENIED(403, "CERTIFICATION-004", "해당 인증서에 대한 접근 권한이 없습니다."),

    // 업로드
    INVALID_UPLOAD_TYPE(400,"UPLOAD-001", "올바르지 않은 업로드 타입입니다."),

    // 상품
    INVALID_PRODUCT_CATEGORY(400, "PRODUCT-001", "유효하지 않은 상품 카테고리입니다.");


    private final int status;
    private final String code;
    private final String message;
}

