package com.cmg.comtogether.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // 공통
    INVALID_INPUT(400, "COMMON-001", "잘못된 입력 값입니다."),
    INVALID_FORMAT(400, "COMMON-002", "요청 본문의 형식이 올바르지 않습니다."),
    INTERNAL_SERVER_ERROR(500, "COMMON-999", "서버 에러가 발생했습니다."),

    // 유저
    USER_NOT_FOUND(404, "USER-001", "사용자를 찾을 수 없습니다."),

    // 인증/인가
    UNAUTHORIZED(401, "AUTH-001", "인증이 필요합니다."),
    TOKEN_EXPIRED(401, "AUTH-002", "토큰이 만료되었습니다."),
    INVALID_TOKEN(401, "AUTH-003", "유효하지 않은 토큰입니다."),
    FORBIDDEN(403, "AUTH-004", "접근 권한이 없습니다."),

    // 카카오 API
    OAUTH_INVALID_CODE(400, "OAUTH-000", "유효하지 않은 인가 코드입니다."),
    OAUTH_PROVIDER_ERROR(502, "OAUTH-999", "카카오 서버와 통신 중 오류가 발생했습니다.");

    private final int status;
    private final String code;
    private final String message;
}

