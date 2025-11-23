package com.cmg.comtogether.compatibility.service;

import com.cmg.comtogether.compatibility.dto.CompatibilityCheckResultDto;
import com.cmg.comtogether.compatibility.dto.CompatibilityItemDto;
import com.cmg.comtogether.gemini.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompatibilityCheckService {

    private final GeminiService geminiService;
    private final CompatibilityPromptService promptService;

    /**
     * 호환성 체크용 스레드 풀
     */
    @Qualifier("compatibilityCheckExecutor")
    private final Executor compatibilityCheckExecutor;

    /**
     * 호환성 체크 실행 (비동기)
     * @param items 견적 아이템 목록
     * @param resultCallback 각 검사 항목 완료 시 호출되는 콜백
     */
    @Async("compatibilityCheckExecutor")
    public CompletableFuture<Void> checkCompatibility(
            List<CompatibilityItemDto> items,
            Consumer<CompatibilityCheckResultDto> resultCallback
    ) {
        log.info("[CompatibilityCheckService] checkCompatibility 시작, thread={}", Thread.currentThread().getName());

        // 결과 콜백에 공통 로깅 래핑
        Consumer<CompatibilityCheckResultDto> loggingCallback = result -> {
            if (result != null) {
                log.info(
                        "[CompatibilityCheckService] 검사 결과 콜백: id={}, name={}, result={}, status={}, thread={}",
                        result.getCheckId(),
                        result.getCheckName(),
                        result.getResult(),
                        result.getStatus(),
                        Thread.currentThread().getName()
                );
            } else {
                log.warn("[CompatibilityCheckService] 검사 결과 콜백: result=null, thread={}", Thread.currentThread().getName());
            }
            resultCallback.accept(result);
        };
        // 카테고리별로 아이템 분류
        Map<String, List<CompatibilityItemDto>> itemsByCategory = items.stream()
                .collect(Collectors.groupingBy(
                        item -> item.getCategory3() != null ? item.getCategory3() : "UNKNOWN"
                ));

        // 10개 검사 항목을 병렬로 실행 (스레드 풀 직접 사용)
        List<CompletableFuture<Void>> futures = List.of(
                CompletableFuture.runAsync(
                        () -> checkCpuMotherboardCompatibility(itemsByCategory, loggingCallback),
                        compatibilityCheckExecutor
                ),
                CompletableFuture.runAsync(
                        () -> checkMemoryTypeCompatibility(itemsByCategory, loggingCallback),
                        compatibilityCheckExecutor
                ),
                CompletableFuture.runAsync(
                        () -> checkMemorySpeedCompatibility(itemsByCategory, loggingCallback),
                        compatibilityCheckExecutor
                ),
                CompletableFuture.runAsync(
                        () -> checkMotherboardCaseFormFactor(itemsByCategory, loggingCallback),
                        compatibilityCheckExecutor
                ),
                CompletableFuture.runAsync(
                        () -> checkGpuCaseCompatibility(itemsByCategory, loggingCallback),
                        compatibilityCheckExecutor
                ),
                CompletableFuture.runAsync(
                        () -> checkPowerStability(itemsByCategory, loggingCallback),
                        compatibilityCheckExecutor
                ),
                CompletableFuture.runAsync(
                        () -> checkPowerConnector(itemsByCategory, loggingCallback),
                        compatibilityCheckExecutor
                ),
                CompletableFuture.runAsync(
                        () -> checkStorageCompatibility(itemsByCategory, loggingCallback),
                        compatibilityCheckExecutor
                ),
                CompletableFuture.runAsync(
                        () -> checkCoolerCompatibility(itemsByCategory, loggingCallback),
                        compatibilityCheckExecutor
                ),
                CompletableFuture.runAsync(
                        () -> checkOsCompatibility(itemsByCategory, loggingCallback),
                        compatibilityCheckExecutor
                )
        );

        // 모든 검사 완료를 비동기적으로 기다림
        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
    }

    /**
     * 1번 검사: CPU ↔ 메인보드 호환성
     */
    private void checkCpuMotherboardCompatibility(
            Map<String, List<CompatibilityItemDto>> itemsByCategory,
            Consumer<CompatibilityCheckResultDto> resultCallback
    ) {
        try {
            List<CompatibilityItemDto> cpus = getItemsByCategory(itemsByCategory, "CPU");
            List<CompatibilityItemDto> motherboards = getItemsByCategory(itemsByCategory, "메인보드");

            if (cpus.isEmpty() || motherboards.isEmpty()) {
                CompatibilityCheckResultDto result = CompatibilityCheckResultDto.builder()
                        .checkId(1)
                        .checkName("CPU ↔ 메인보드 호환성")
                        .status("COMPLETED")
                        .result("UNKNOWN")
                        .errors(List.of("CPU 또는 메인보드가 없습니다."))
                        .warnings(List.of())
                        .details("")
                        .build();
                resultCallback.accept(result);
                return;
            }

            // 첫 번째 CPU와 메인보드 사용 (여러 개인 경우 첫 번째 것 사용)
            CompatibilityItemDto cpu = cpus.get(0);
            CompatibilityItemDto mb = motherboards.get(0);

            // 프롬프트 생성
            String prompt = promptService.buildCpuMotherboardPrompt(cpu.getTitle(), mb.getTitle());

            // Gemini API 호출
            String response = geminiService.generateText(prompt);

            // 응답 파싱 및 결과 생성
            CompatibilityCheckResultDto result = promptService.parseCompatibilityResponse(
                    response, 1, "CPU ↔ 메인보드 호환성"
            );

            sendResultWithDelay(result, resultCallback);

        } catch (Exception e) {
            log.error("CPU ↔ 메인보드 호환성 검사 중 오류 발생", e);
            CompatibilityCheckResultDto errorResult = CompatibilityCheckResultDto.builder()
                    .checkId(1)
                    .checkName("CPU ↔ 메인보드 호환성")
                    .status("ERROR")
                    .result("UNKNOWN")
                    .errors(List.of("검사 중 오류가 발생했습니다: " + e.getMessage()))
                    .warnings(List.of())
                    .details("")
                    .build();
            resultCallback.accept(errorResult);
        }
    }

    /**
     * 2번 검사: 메모리 타입 호환성 (메인보드 ↔ RAM)
     */
    private void checkMemoryTypeCompatibility(
            Map<String, List<CompatibilityItemDto>> itemsByCategory,
            Consumer<CompatibilityCheckResultDto> resultCallback
    ) {
        try {
            List<CompatibilityItemDto> motherboards = getItemsByCategory(itemsByCategory, "메인보드");
            List<CompatibilityItemDto> rams = getItemsByCategory(itemsByCategory, "RAM");

            if (motherboards.isEmpty() || rams.isEmpty()) {
                CompatibilityCheckResultDto result = CompatibilityCheckResultDto.builder()
                        .checkId(2)
                        .checkName("메모리 타입 호환성")
                        .status("COMPLETED")
                        .result("UNKNOWN")
                        .errors(List.of("메인보드 또는 메모리가 없습니다."))
                        .warnings(List.of())
                        .details("")
                        .build();
                resultCallback.accept(result);
                return;
            }

            CompatibilityItemDto mb = motherboards.get(0);
            CompatibilityItemDto ram = rams.get(0);

            String prompt = promptService.buildMemoryTypePrompt(mb.getTitle(), ram.getTitle());
            String response = geminiService.generateText(prompt);
            CompatibilityCheckResultDto result = promptService.parseCompatibilityResponse(
                    response, 2, "메모리 타입 호환성"
            );
            resultCallback.accept(result);

        } catch (Exception e) {
            log.error("메모리 타입 호환성 검사 중 오류 발생", e);
            CompatibilityCheckResultDto errorResult = CompatibilityCheckResultDto.builder()
                    .checkId(2)
                    .checkName("메모리 타입 호환성")
                    .status("ERROR")
                    .result("UNKNOWN")
                    .errors(List.of("검사 중 오류가 발생했습니다: " + e.getMessage()))
                    .warnings(List.of())
                    .details("")
                    .build();
            resultCallback.accept(errorResult);
        }
    }

    /**
     * 3번 검사: 메모리 속도 호환성 (메인보드 ↔ RAM)
     */
    private void checkMemorySpeedCompatibility(
            Map<String, List<CompatibilityItemDto>> itemsByCategory,
            Consumer<CompatibilityCheckResultDto> resultCallback
    ) {
        try {
            List<CompatibilityItemDto> motherboards = getItemsByCategory(itemsByCategory, "메인보드");
            List<CompatibilityItemDto> rams = getItemsByCategory(itemsByCategory, "RAM");

            if (motherboards.isEmpty() || rams.isEmpty()) {
                CompatibilityCheckResultDto result = CompatibilityCheckResultDto.builder()
                        .checkId(3)
                        .checkName("메모리 속도 호환성")
                        .status("COMPLETED")
                        .result("UNKNOWN")
                        .errors(List.of("메인보드 또는 메모리가 없습니다."))
                        .warnings(List.of())
                        .details("")
                        .build();
                resultCallback.accept(result);
                return;
            }

            CompatibilityItemDto mb = motherboards.get(0);
            CompatibilityItemDto ram = rams.get(0);

            String prompt = promptService.buildMemorySpeedPrompt(mb.getTitle(), ram.getTitle());
            String response = geminiService.generateText(prompt);
            CompatibilityCheckResultDto result = promptService.parseCompatibilityResponse(
                    response, 3, "메모리 속도 호환성"
            );
            resultCallback.accept(result);

        } catch (Exception e) {
            log.error("메모리 속도 호환성 검사 중 오류 발생", e);
            CompatibilityCheckResultDto errorResult = CompatibilityCheckResultDto.builder()
                    .checkId(3)
                    .checkName("메모리 속도 호환성")
                    .status("ERROR")
                    .result("UNKNOWN")
                    .errors(List.of("검사 중 오류가 발생했습니다: " + e.getMessage()))
                    .warnings(List.of())
                    .details("")
                    .build();
            resultCallback.accept(errorResult);
        }
    }

    /**
     * 4번 검사: 메인보드 ↔ 케이스 폼팩 호환성
     */
    private void checkMotherboardCaseFormFactor(
            Map<String, List<CompatibilityItemDto>> itemsByCategory,
            Consumer<CompatibilityCheckResultDto> resultCallback
    ) {
        try {
            List<CompatibilityItemDto> motherboards = getItemsByCategory(itemsByCategory, "메인보드");
            List<CompatibilityItemDto> cases = getItemsByCategory(itemsByCategory, "케이스");

            if (motherboards.isEmpty() || cases.isEmpty()) {
                CompatibilityCheckResultDto result = CompatibilityCheckResultDto.builder()
                        .checkId(4)
                        .checkName("메인보드 ↔ 케이스 폼팩 호환성")
                        .status("COMPLETED")
                        .result("UNKNOWN")
                        .errors(List.of("메인보드 또는 케이스가 없습니다."))
                        .warnings(List.of())
                        .details("")
                        .build();
                resultCallback.accept(result);
                return;
            }

            CompatibilityItemDto mb = motherboards.get(0);
            CompatibilityItemDto caseItem = cases.get(0);

            String prompt = promptService.buildMotherboardCaseFormFactorPrompt(mb.getTitle(), caseItem.getTitle());
            String response = geminiService.generateText(prompt);
            CompatibilityCheckResultDto result = promptService.parseCompatibilityResponse(
                    response, 4, "메인보드 ↔ 케이스 폼팩 호환성"
            );
            resultCallback.accept(result);

        } catch (Exception e) {
            log.error("메인보드 ↔ 케이스 폼팩 호환성 검사 중 오류 발생", e);
            CompatibilityCheckResultDto errorResult = CompatibilityCheckResultDto.builder()
                    .checkId(4)
                    .checkName("메인보드 ↔ 케이스 폼팩 호환성")
                    .status("ERROR")
                    .result("UNKNOWN")
                    .errors(List.of("검사 중 오류가 발생했습니다: " + e.getMessage()))
                    .warnings(List.of())
                    .details("")
                    .build();
            resultCallback.accept(errorResult);
        }
    }

    /**
     * 5번 검사: GPU ↔ 케이스 호환성
     */
    private void checkGpuCaseCompatibility(
            Map<String, List<CompatibilityItemDto>> itemsByCategory,
            Consumer<CompatibilityCheckResultDto> resultCallback
    ) {
        try {
            List<CompatibilityItemDto> gpus = getItemsByCategory(itemsByCategory, "그래픽카드");
            List<CompatibilityItemDto> cases = getItemsByCategory(itemsByCategory, "케이스");

            if (gpus.isEmpty() || cases.isEmpty()) {
                CompatibilityCheckResultDto result = CompatibilityCheckResultDto.builder()
                        .checkId(5)
                        .checkName("GPU ↔ 케이스 호환성")
                        .status("COMPLETED")
                        .result("UNKNOWN")
                        .errors(List.of("GPU 또는 케이스가 없습니다."))
                        .warnings(List.of())
                        .details("")
                        .build();
                resultCallback.accept(result);
                return;
            }

            CompatibilityItemDto gpu = gpus.get(0);
            CompatibilityItemDto caseItem = cases.get(0);

            String prompt = promptService.buildGpuCasePrompt(gpu.getTitle(), caseItem.getTitle());
            String response = geminiService.generateText(prompt);
            CompatibilityCheckResultDto result = promptService.parseCompatibilityResponse(
                    response, 5, "GPU ↔ 케이스 호환성"
            );
            resultCallback.accept(result);

        } catch (Exception e) {
            log.error("GPU ↔ 케이스 호환성 검사 중 오류 발생", e);
            CompatibilityCheckResultDto errorResult = CompatibilityCheckResultDto.builder()
                    .checkId(5)
                    .checkName("GPU ↔ 케이스 호환성")
                    .status("ERROR")
                    .result("UNKNOWN")
                    .errors(List.of("검사 중 오류가 발생했습니다: " + e.getMessage()))
                    .warnings(List.of())
                    .details("")
                    .build();
            resultCallback.accept(errorResult);
        }
    }

    /**
     * 6번 검사: 전력 안정성 (CPU + GPU ↔ PSU)
     */
    private void checkPowerStability(
            Map<String, List<CompatibilityItemDto>> itemsByCategory,
            Consumer<CompatibilityCheckResultDto> resultCallback
    ) {
        try {
            List<CompatibilityItemDto> cpus = getItemsByCategory(itemsByCategory, "CPU");
            List<CompatibilityItemDto> gpus = getItemsByCategory(itemsByCategory, "그래픽카드");
            List<CompatibilityItemDto> psus = getItemsByCategory(itemsByCategory, "파워 서플라이");

            if (cpus.isEmpty() || gpus.isEmpty() || psus.isEmpty()) {
                CompatibilityCheckResultDto result = CompatibilityCheckResultDto.builder()
                        .checkId(6)
                        .checkName("전력 안정성")
                        .status("COMPLETED")
                        .result("UNKNOWN")
                        .errors(List.of("CPU, GPU 또는 파워가 없습니다."))
                        .warnings(List.of())
                        .details("")
                        .build();
                resultCallback.accept(result);
                return;
            }

            CompatibilityItemDto cpu = cpus.get(0);
            CompatibilityItemDto gpu = gpus.get(0);
            CompatibilityItemDto psu = psus.get(0);

            String prompt = promptService.buildPowerStabilityPrompt(cpu.getTitle(), gpu.getTitle(), psu.getTitle());
            String response = geminiService.generateText(prompt);
            CompatibilityCheckResultDto result = promptService.parseCompatibilityResponse(
                    response, 6, "전력 안정성"
            );
            resultCallback.accept(result);

        } catch (Exception e) {
            log.error("전력 안정성 검사 중 오류 발생", e);
            CompatibilityCheckResultDto errorResult = CompatibilityCheckResultDto.builder()
                    .checkId(6)
                    .checkName("전력 안정성")
                    .status("ERROR")
                    .result("UNKNOWN")
                    .errors(List.of("검사 중 오류가 발생했습니다: " + e.getMessage()))
                    .warnings(List.of())
                    .details("")
                    .build();
            resultCallback.accept(errorResult);
        }
    }

    /**
     * 7번 검사: 파워 커넥터 호환성 (GPU ↔ PSU)
     */
    private void checkPowerConnector(
            Map<String, List<CompatibilityItemDto>> itemsByCategory,
            Consumer<CompatibilityCheckResultDto> resultCallback
    ) {
        try {
            List<CompatibilityItemDto> gpus = getItemsByCategory(itemsByCategory, "그래픽카드");
            List<CompatibilityItemDto> psus = getItemsByCategory(itemsByCategory, "파워 서플라이");

            if (gpus.isEmpty() || psus.isEmpty()) {
                CompatibilityCheckResultDto result = CompatibilityCheckResultDto.builder()
                        .checkId(7)
                        .checkName("파워 커넥터 호환성")
                        .status("COMPLETED")
                        .result("UNKNOWN")
                        .errors(List.of("GPU 또는 파워가 없습니다."))
                        .warnings(List.of())
                        .details("")
                        .build();
                resultCallback.accept(result);
                return;
            }

            CompatibilityItemDto gpu = gpus.get(0);
            CompatibilityItemDto psu = psus.get(0);

            String prompt = promptService.buildPowerConnectorPrompt(gpu.getTitle(), psu.getTitle());
            String response = geminiService.generateText(prompt);
            CompatibilityCheckResultDto result = promptService.parseCompatibilityResponse(
                    response, 7, "파워 커넥터 호환성"
            );
            resultCallback.accept(result);

        } catch (Exception e) {
            log.error("파워 커넥터 호환성 검사 중 오류 발생", e);
            CompatibilityCheckResultDto errorResult = CompatibilityCheckResultDto.builder()
                    .checkId(7)
                    .checkName("파워 커넥터 호환성")
                    .status("ERROR")
                    .result("UNKNOWN")
                    .errors(List.of("검사 중 오류가 발생했습니다: " + e.getMessage()))
                    .warnings(List.of())
                    .details("")
                    .build();
            resultCallback.accept(errorResult);
        }
    }

    /**
     * 8번 검사: 스토리지 호환성 (메인보드 ↔ 스토리지)
     */
    private void checkStorageCompatibility(
            Map<String, List<CompatibilityItemDto>> itemsByCategory,
            Consumer<CompatibilityCheckResultDto> resultCallback
    ) {
        try {
            List<CompatibilityItemDto> motherboards = getItemsByCategory(itemsByCategory, "메인보드");
            List<CompatibilityItemDto> storages = getItemsByCategory(itemsByCategory, "저장장치");

            if (motherboards.isEmpty() || storages.isEmpty()) {
                CompatibilityCheckResultDto result = CompatibilityCheckResultDto.builder()
                        .checkId(8)
                        .checkName("스토리지 호환성")
                        .status("COMPLETED")
                        .result("UNKNOWN")
                        .errors(List.of("메인보드 또는 스토리지가 없습니다."))
                        .warnings(List.of())
                        .details("")
                        .build();
                resultCallback.accept(result);
                return;
            }

            CompatibilityItemDto mb = motherboards.get(0);
            CompatibilityItemDto storage = storages.get(0);

            String prompt = promptService.buildStoragePrompt(mb.getTitle(), storage.getTitle());
            String response = geminiService.generateText(prompt);
            CompatibilityCheckResultDto result = promptService.parseCompatibilityResponse(
                    response, 8, "스토리지 호환성"
            );
            resultCallback.accept(result);

        } catch (Exception e) {
            log.error("스토리지 호환성 검사 중 오류 발생", e);
            CompatibilityCheckResultDto errorResult = CompatibilityCheckResultDto.builder()
                    .checkId(8)
                    .checkName("스토리지 호환성")
                    .status("ERROR")
                    .result("UNKNOWN")
                    .errors(List.of("검사 중 오류가 발생했습니다: " + e.getMessage()))
                    .warnings(List.of())
                    .details("")
                    .build();
            resultCallback.accept(errorResult);
        }
    }

    /**
     * 9번 검사: CPU 쿨러 ↔ 케이스/램 호환성
     */
    private void checkCoolerCompatibility(
            Map<String, List<CompatibilityItemDto>> itemsByCategory,
            Consumer<CompatibilityCheckResultDto> resultCallback
    ) {
        try {
            List<CompatibilityItemDto> coolers = getItemsByCategory(itemsByCategory, "쿨러/팬");
            List<CompatibilityItemDto> cases = getItemsByCategory(itemsByCategory, "케이스");
            List<CompatibilityItemDto> rams = getItemsByCategory(itemsByCategory, "RAM");

            if (coolers.isEmpty() || cases.isEmpty() || rams.isEmpty()) {
                CompatibilityCheckResultDto result = CompatibilityCheckResultDto.builder()
                        .checkId(9)
                        .checkName("CPU 쿨러 ↔ 케이스/램 호환성")
                        .status("COMPLETED")
                        .result("UNKNOWN")
                        .errors(List.of("쿨러, 케이스 또는 RAM이 없습니다."))
                        .warnings(List.of())
                        .details("")
                        .build();
                resultCallback.accept(result);
                return;
            }

            CompatibilityItemDto cooler = coolers.get(0);
            CompatibilityItemDto caseItem = cases.get(0);
            CompatibilityItemDto ram = rams.get(0);

            String prompt = promptService.buildCoolerCompatibilityPrompt(cooler.getTitle(), caseItem.getTitle(), ram.getTitle());
            String response = geminiService.generateText(prompt);
            CompatibilityCheckResultDto result = promptService.parseCompatibilityResponse(
                    response, 9, "CPU 쿨러 ↔ 케이스/램 호환성"
            );
            resultCallback.accept(result);

        } catch (Exception e) {
            log.error("CPU 쿨러 ↔ 케이스/램 호환성 검사 중 오류 발생", e);
            CompatibilityCheckResultDto errorResult = CompatibilityCheckResultDto.builder()
                    .checkId(9)
                    .checkName("CPU 쿨러 ↔ 케이스/램 호환성")
                    .status("ERROR")
                    .result("UNKNOWN")
                    .errors(List.of("검사 중 오류가 발생했습니다: " + e.getMessage()))
                    .warnings(List.of())
                    .details("")
                    .build();
            resultCallback.accept(errorResult);
        }
    }

    /**
     * 10번 검사: OS/드라이버 호환성 (CPU ↔ OS)
     */
    private void checkOsCompatibility(
            Map<String, List<CompatibilityItemDto>> itemsByCategory,
            Consumer<CompatibilityCheckResultDto> resultCallback
    ) {
        try {
            List<CompatibilityItemDto> cpus = getItemsByCategory(itemsByCategory, "CPU");
            List<CompatibilityItemDto> oses = getItemsByCategory(itemsByCategory, "기타 입출력 장치");

            if (cpus.isEmpty() || oses.isEmpty()) {
                CompatibilityCheckResultDto result = CompatibilityCheckResultDto.builder()
                        .checkId(10)
                        .checkName("OS/드라이버 호환성")
                        .status("COMPLETED")
                        .result("UNKNOWN")
                        .errors(List.of("CPU 또는 OS가 없습니다."))
                        .warnings(List.of())
                        .details("")
                        .build();
                resultCallback.accept(result);
                return;
            }

            CompatibilityItemDto cpu = cpus.get(0);
            CompatibilityItemDto os = oses.get(0);

            String prompt = promptService.buildOsCompatibilityPrompt(cpu.getTitle(), os.getTitle());
            String response = geminiService.generateText(prompt);
            CompatibilityCheckResultDto result = promptService.parseCompatibilityResponse(
                    response, 10, "OS/드라이버 호환성"
            );
            resultCallback.accept(result);

        } catch (Exception e) {
            log.error("OS/드라이버 호환성 검사 중 오류 발생", e);
            CompatibilityCheckResultDto errorResult = CompatibilityCheckResultDto.builder()
                    .checkId(10)
                    .checkName("OS/드라이버 호환성")
                    .status("ERROR")
                    .result("UNKNOWN")
                    .errors(List.of("검사 중 오류가 발생했습니다: " + e.getMessage()))
                    .warnings(List.of())
                    .details("")
                    .build();
            resultCallback.accept(errorResult);
        }
    }

    /**
     * 결과 전송 전 딜레이 추가 (테스트용: 실시간 스트리밍 확인)
     * 체크 ID * 0.5초씩 딜레이를 추가하여 순차적으로 결과가 오는 것을 확인 가능
     */
    private void sendResultWithDelay(CompatibilityCheckResultDto result, Consumer<CompatibilityCheckResultDto> resultCallback) {
        // 테스트용: 실시간 스트리밍 확인을 위한 딜레이 (체크 ID * 0.5초)
        try {
            Thread.sleep(500 * result.getCheckId());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        resultCallback.accept(result);
    }

    /**
     * 카테고리에서 아이템 가져오기 (헬퍼 메서드)
     * 프론트엔드 카테고리명: CPU, 메인보드, RAM, 그래픽카드, 저장장치, 파워 서플라이, 케이스, 쿨러/팬, 기타 입출력 장치
     */
    private List<CompatibilityItemDto> getItemsByCategory(
            Map<String, List<CompatibilityItemDto>> itemsByCategory, String categoryName
    ) {
        return itemsByCategory.getOrDefault(categoryName, List.of());
    }
}

