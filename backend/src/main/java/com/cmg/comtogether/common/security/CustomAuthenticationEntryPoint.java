package com.cmg.comtogether.common.security;

import com.cmg.comtogether.common.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        ErrorCode errorCode = (ErrorCode) request.getAttribute("exception");
        if (errorCode == null) {
            errorCode = ErrorCode.UNAUTHORIZED; // 토큰 없음
        }

        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(errorCode.getStatus());

        String body = """
        {
          "code": "%s",
          "message": "%s"
        }
        """.formatted(errorCode.getCode(), errorCode.getMessage());

        response.getWriter().write(body);
    }
}

