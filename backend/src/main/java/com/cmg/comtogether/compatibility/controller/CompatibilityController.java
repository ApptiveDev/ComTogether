package com.cmg.comtogether.compatibility.controller;

import com.cmg.comtogether.compatibility.dto.CompatibilityCheckRequestDto;
import com.cmg.comtogether.compatibility.service.CompatibilityCheckService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

@Slf4j
@RestController
@RequestMapping("/compatibility")
@RequiredArgsConstructor
public class CompatibilityController {

    private final CompatibilityCheckService compatibilityCheckService;
    private final ObjectMapper objectMapper;

    /**
     * 호환성 체크 (SSE 스트리밍)
     * 각 검사 항목이 완료되는 대로 실시간으로 결과를 전송
     */
    @PostMapping(value = "/check", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> checkCompatibility(
            @Valid @RequestBody CompatibilityCheckRequestDto requestDto
    ) {
        SseEmitter emitter = new SseEmitter(300000L); // 5분 타임아웃

        // 초기 연결 확인
        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("호환성 체크를 시작합니다."));
        } catch (IOException e) {
            log.error("SSE 초기 연결 실패", e);
            emitter.completeWithError(e);
            return ResponseEntity.ok(emitter);
        }

        // 비동기로 호환성 체크 실행
        CompletableFuture.runAsync(() -> {
            try {
                compatibilityCheckService.checkCompatibility(
                        requestDto.getItems(),
                        result -> {
                            try {
                                // JSON을 포맷팅하여 가독성 향상
                                String formattedJson = objectMapper.writerWithDefaultPrettyPrinter()
                                        .writeValueAsString(result);
                                
                                // 각 검사 항목 완료 시 SSE로 전송 (포맷팅된 JSON 사용)
                                emitter.send(SseEmitter.event()
                                        .name("result")
                                        .data(formattedJson));
                            } catch (IOException e) {
                                log.error("SSE 전송 실패", e);
                                emitter.completeWithError(e);
                            }
                        }
                ).join();

                // 모든 검사 완료
                emitter.send(SseEmitter.event()
                        .name("completed")
                        .data("모든 호환성 검사가 완료되었습니다."));
                emitter.complete();

            } catch (Exception e) {
                log.error("호환성 체크 중 오류 발생", e);
                try {
                    emitter.send(SseEmitter.event()
                            .name("error")
                            .data("호환성 체크 중 오류가 발생했습니다: " + e.getMessage()));
                } catch (IOException ioException) {
                    log.error("에러 메시지 전송 실패", ioException);
                }
                emitter.completeWithError(e);
            }
        });

        // 연결 종료 시 처리
        emitter.onCompletion(() -> log.debug("SSE 연결 완료"));
        emitter.onTimeout(() -> {
            log.warn("SSE 연결 타임아웃");
            emitter.complete();
        });
        emitter.onError((ex) -> {
            log.error("SSE 연결 오류", ex);
            emitter.completeWithError(ex);
        });

        return ResponseEntity.ok(emitter);
    }
}

