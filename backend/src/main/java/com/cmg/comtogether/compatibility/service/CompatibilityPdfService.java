package com.cmg.comtogether.compatibility.service;

import com.cmg.comtogether.compatibility.dto.CompatibilityCheckResultDto;
import com.cmg.comtogether.compatibility.dto.CompatibilityItemDto;
import com.cmg.comtogether.compatibility.dto.CompatibilityPdfRequestDto;
import com.cmg.comtogether.user.entity.User;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 호환성 체크 결과를 PDF로 변환.
 * HTML 문자열을 만들어 openhtmltopdf로 렌더링한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CompatibilityPdfService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public byte[] generatePdf(CompatibilityPdfRequestDto request, User user) {
        String html = buildHtml(request, user);
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            // 한글 폰트 등록 (resources/fonts/Pretendard-Medium.ttf 필요, classpath 기준)
            registerKoreanFont(builder, "/fonts/Pretendard-Medium.ttf", "Pretendard");
            builder.withHtmlContent(html, null);
            builder.toStream(baos);
            builder.run();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("PDF 생성 중 오류", e);
            throw new IllegalStateException("PDF 생성에 실패했습니다.", e);
        }
    }

    private String buildHtml(CompatibilityPdfRequestDto request, User user) {
        String title = (request.getTitle() != null && !request.getTitle().isBlank())
                ? request.getTitle()
                : "부품 견적서";
        String generatedAt = LocalDateTime.now().format(DATE_FORMATTER);

        String itemsSection = buildItemsSection(request.getItems());
        String resultsSection = buildResultsSection(request.getResults());

        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8" />
                  <style>
                    body { font-family: 'Pretendard', 'Noto Sans KR', 'Nanum Gothic', 'Arial', sans-serif; margin: 24px; }
                    h1 { font-size: 20px; margin-bottom: 8px; }
                    h2 { font-size: 16px; margin-top: 18px; margin-bottom: 8px; }
                    table { border-collapse: collapse; width: 100%%; font-size: 12px; }
                    th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
                    th { background: #f2f2f2; }
                    .meta { margin-bottom: 16px; font-size: 12px; color: #444; }
                  </style>
                </head>
                <body>
                  <h1>%s</h1>
                  <div class="meta">
                    <div>생성 시각: %s</div>
                    <div>사용자: %s</div>
                  </div>
                  %s
                  %s
                </body>
                </html>
                """.formatted(title, generatedAt, user != null ? user.getEmail() : "N/A", itemsSection, resultsSection);
    }

    private String buildItemsSection(List<CompatibilityItemDto> items) {
        if (items == null || items.isEmpty()) {
            return "";
        }
        String rows = items.stream()
                .map(item -> """
                        <tr>
                          <td>%s</td>
                          <td>%s</td>
                        </tr>
                        """.formatted(escape(item.getCategory3()), escape(item.getTitle())))
                .collect(Collectors.joining());

        return """
                <h2>아이템</h2>
                <table>
                  <thead>
                    <tr><th>카테고리</th><th>제품명</th></tr>
                  </thead>
                  <tbody>
                    %s
                  </tbody>
                </table>
                """.formatted(rows);
    }

    private String buildResultsSection(List<CompatibilityCheckResultDto> results) {
        String rows = results.stream()
                .map(result -> """
                        <tr>
                          <td>%s</td>
                          <td>%s</td>
                          <td>%s</td>
                          <td>%s</td>
                          <td>%s</td>
                        </tr>
                        """.formatted(
                        safe(result.getCheckId()),
                        escape(result.getCheckName()),
                        mapResult(result.getResult()),
                        listToLine(result.getWarnings()),
                        listToLine(result.getErrors())
                ))
                .collect(Collectors.joining());

        return """
                <h2>호환성 검사 결과</h2>
                <table>
                  <colgroup>
                    <col style="width: 5%%;" />
                    <col style="width: 20%%;" />
                    <col style="width: 7%%;" />
                    <col style="width: 30%%;" />
                    <col style="width: 30%%;" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>검사 항목</th>
                      <th>결과</th>
                      <th>경고</th>
                      <th>오류</th>
                    </tr>
                  </thead>
                  <tbody>
                    %s
                  </tbody>
                </table>
                """.formatted(rows);
    }

    private String listToLine(List<String> list) {
        if (list == null || list.isEmpty()) {
            return "";
        }
        return escape(String.join(" | ", list));
    }

    private String mapResult(String result) {
        if (result == null) return "";
        return switch (result.toUpperCase()) {
            case "POSITIVE" -> "적합";
            case "WARNING" -> "주의";
            case "NEGATIVE" -> "부적합";
            case "UNKNOWN" -> "정보 없음";
            default -> result;
        };
    }

    private String escape(String value) {
        if (value == null) return "";
        return value
                .replace("%", "%%") // formatted() 에서 %가 포맷 문자열로 해석되지 않도록 이스케이프
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }

    private String safe(Object obj) {
        return obj == null ? "" : obj.toString();
    }

    /**
     * 한글 폰트 등록 시 사용할 유틸 (폰트 파일을 resources/fonts에 두면 적용).
     * 사용 예: registerKoreanFont(builder, "/fonts/NotoSansKR-Regular.ttf");
     */
    @SuppressWarnings("unused")
    private void registerKoreanFont(PdfRendererBuilder builder, String classpathFontPath, String fontFamily) {
        try (var is = getClass().getResourceAsStream(classpathFontPath)) {
            if (is == null) {
                log.warn("Korean font not found on classpath: {}", classpathFontPath);
                return;
            }
            builder.useFont(() -> getClass().getResourceAsStream(classpathFontPath),
                    fontFamily, 400, PdfRendererBuilder.FontStyle.NORMAL, true);
            log.info("Registered Korean font for PDF: {}", fontFamily);
        } catch (Exception e) {
            log.warn("Failed to register Korean font: {}", classpathFontPath, e);
        }
    }
}
