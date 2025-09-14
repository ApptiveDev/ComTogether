package com.cmg.comtogether.common.exception;

import com.cmg.comtogether.common.response.ErrorResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import java.security.SignatureException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException e) {
        FieldError fieldError = e.getBindingResult().getFieldError();
        String message = (fieldError != null) ? fieldError.getDefaultMessage() : ErrorCode.INVALID_INPUT.getMessage();

        return ResponseEntity
                .status(ErrorCode.INVALID_INPUT.getStatus())
                .body(ErrorResponse.of(ErrorCode.INVALID_INPUT, message));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException e) {
        return ResponseEntity
                .status(ErrorCode.INVALID_FORMAT.getStatus())
                .body(ErrorResponse.of(ErrorCode.INVALID_FORMAT, ErrorCode.INVALID_FORMAT.getMessage()));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        ErrorCode errorCode = e.getErrorCode();
        return ResponseEntity
                .status(errorCode.getStatus())
                .body(ErrorResponse.of(errorCode));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        log.error("Unexpected Exception: ", e);
        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
        return ResponseEntity
                .status(errorCode.getStatus())
                .body(ErrorResponse.of(errorCode));
    }
}

