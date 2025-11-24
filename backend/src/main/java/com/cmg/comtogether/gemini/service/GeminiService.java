package com.cmg.comtogether.gemini.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("gemini-2.0-flash")
    private String modelName;

    private final RestClient restClient;

    private static final String GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

    private static final float FIXED_TEMPERATURE = 0.1f;
    private static final int FIXED_MAX_OUTPUT_TOKENS = 2048;

    /**
     * 텍스트 생성 요청
     * @param prompt 생성할 텍스트의 프롬프트
     * @return 생성된 텍스트 응답
     */
    public String generateText(String prompt) {
        try {
            String url = String.format("%s/%s:generateContent?key=%s", 
                    GEMINI_API_BASE_URL, modelName, apiKey);

            // 요청 본문 구성
            Map<String, Object> requestBody = new HashMap<>();
            
            // 콘텐츠 부분 추가
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);
            requestBody.put("contents", List.of(Map.of("parts", List.of(part))));

            // 생성 설정 추가 (고정값 사용)
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", FIXED_TEMPERATURE);
            generationConfig.put("maxOutputTokens", FIXED_MAX_OUTPUT_TOKENS);
            generationConfig.put("topP", 0.8);
            generationConfig.put("topK", 40);
            requestBody.put("generationConfig", generationConfig);

            // 안전 설정 추가
            List<Map<String, Object>> safetySettings = List.of(
                    createSafetySetting("HARM_CATEGORY_HATE_SPEECH", "BLOCK_MEDIUM_AND_ABOVE"),
                    createSafetySetting("HARM_CATEGORY_HARASSMENT", "BLOCK_MEDIUM_AND_ABOVE"),
                    createSafetySetting("HARM_CATEGORY_SEXUALLY_EXPLICIT", "BLOCK_MEDIUM_AND_ABOVE"),
                    createSafetySetting("HARM_CATEGORY_DANGEROUS_CONTENT", "BLOCK_MEDIUM_AND_ABOVE")
            );
            requestBody.put("safetySettings", safetySettings);

            // API 호출
            log.debug("Gemini API 호출 - URL: {}", url);
            log.debug("Gemini API 요청 본문: {}", requestBody);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {
                        log.error("Gemini API 4xx 에러 - Status: {}", res.getStatusCode());
                        log.error("Request URL: {}", req.getURI());
                        throw new BusinessException(ErrorCode.GEMINI_API_ERROR);
                    })
                    .onStatus(HttpStatusCode::is5xxServerError, (req, res) -> {
                        log.error("Gemini API 5xx 에러 - Status: {}", res.getStatusCode());
                        log.error("Request URL: {}", req.getURI());
                        throw new BusinessException(ErrorCode.GEMINI_API_ERROR);
                    })
                    .body(Map.class);

            log.debug("Gemini API 응답: {}", response);

            // 응답 처리
            if (response != null && response.containsKey("candidates")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    if (candidate.containsKey("content")) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> content = (Map<String, Object>) candidate.get("content");
                        if (content != null && content.containsKey("parts")) {
                            @SuppressWarnings("unchecked")
                            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                            if (parts != null && !parts.isEmpty()) {
                                Map<String, Object> firstPart = parts.get(0);
                                if (firstPart.containsKey("text")) {
                                    String generatedText = (String) firstPart.get("text");
                                    log.debug("Gemini 생성된 텍스트: {}", generatedText);
                                    return generatedText;
                                }
                            }
                        }
                    }
                }
            }

            log.error("Gemini API 응답 형식이 예상과 다릅니다. 응답: {}", response);
            throw new BusinessException(ErrorCode.GEMINI_API_ERROR);

        } catch (BusinessException e) {
            throw e;
        } catch (RestClientException e) {
            log.error("Gemini API 호출 중 RestClientException 발생", e);
            log.error("에러 메시지: {}", e.getMessage());
            if (e.getCause() != null) {
                log.error("원인: {}", e.getCause().getMessage());
            }
            throw new BusinessException(ErrorCode.GEMINI_API_ERROR);
        } catch (Exception e) {
            log.error("Gemini API 호출 중 예상치 못한 예외 발생", e);
            log.error("예외 타입: {}, 메시지: {}", e.getClass().getName(), e.getMessage());
            throw new BusinessException(ErrorCode.GEMINI_API_ERROR);
        }
    }

    /**
     * 안전 설정 생성 헬퍼 메서드
     */
    private Map<String, Object> createSafetySetting(String category, String threshold) {
        Map<String, Object> setting = new HashMap<>();
        setting.put("category", category);
        setting.put("threshold", threshold);
        return setting;
    }
}
