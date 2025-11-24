package com.cmg.comtogether.compatibility.service;

import com.cmg.comtogether.compatibility.dto.CompatibilityCheckResultDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompatibilityPromptService {

    private static final String COMMON_SYSTEM_PROMPT = """
            You are an expert PC hardware compatibility checker.
            Your goal is to analyze product titles and return a strict JSON response based on technical specifications.
            Do not include any markdown formatting (```json) or additional text outside the JSON object.
            The Output must be a valid JSON object.
            """;

    private final ObjectMapper objectMapper;

    /**
     * 1. CPU ↔ 메인보드 호환성 프롬프트 생성
     */
    public String buildCpuMotherboardPrompt(String cpuTitle, String mbTitle) {
        return COMMON_SYSTEM_PROMPT + """

            [ROLE]
            너는 PC 하드웨어 소켓 및 펌웨어 호환성 분석 전문가다.

            [TASK]
            CPU와 메인보드의 '제목(Title)'을 분석하여 소켓 일치 여부와 바이오스 업데이트 필요성을 판단하라.

            [JUDGMENT CRITERIA]
            1. POSITIVE (정상):
               - 소켓 규격이 정확히 일치함 (예: LGA1700 ↔ LGA1700, AM5 ↔ AM5).
               - 칩셋과 CPU 세대가 기본적으로 호환됨 (예: 인텔 12세대 ↔ B660, 인텔 14세대 ↔ Z790).
            2. NEGATIVE (호환 불가):
               - 소켓 규격 불일치 (예: 인텔 CPU ↔ AMD 보드, LGA1700 ↔ LGA1200).
            3. WARNING (주의 - 바이오스 및 성능):
               - [중요] 인텔 14세대(랩터레이크 리프레시) CPU와 구형 600번대(H610, B660, Z690) 칩셋 조합. -> "바이오스 업데이트 필수" 경고.
               - 물리적 장착은 되나 전원부(VRM)가 부실하여 성능 저하가 우려되는 경우 (예: i9-14900K ↔ H610 보드).

            [INPUT]
            CPU Title: %s
            Motherboard Title: %s

            [OUTPUT JSON]
            {
              "result": "POSITIVE" | "NEGATIVE" | "WARNING",
              "errors": [],
              "warnings": [],
              "details": ""
            }
            """.formatted(cpuTitle, mbTitle);
    }

    /**
     * 2. 메모리 타입 호환성 프롬프트 생성
     */
    public String buildMemoryTypePrompt(String mbTitle, String ramTitle) {
        return COMMON_SYSTEM_PROMPT + """

            [ROLE]
            너는 메인보드와 RAM의 규격(Generation) 호환성 검사기다.

            [TASK]
            메인보드와 메모리의 제목을 보고 DDR 세대(Generation)를 비교하라. 제목에 명시되지 않은 경우 칩셋이나 출시 시기를 통해 추론하라.

            [JUDGMENT CRITERIA]
            1. POSITIVE (정상):
               - 메인보드 지원 타입과 메모리 타입이 일치 (예: DDR5 보드 ↔ DDR5 램).
            2. NEGATIVE (호환 불가):
               - 세대 불일치 (예: DDR4 보드 ↔ DDR5 램).
               - 노트북용(SO-DIMM) 메모리를 데스크탑 보드에 매칭한 경우.
            3. WARNING (정보 부족):
               - 메인보드나 메모리 제목이 모호하여(예: "삼성전자 8G") DDR4/5 구분이 100%% 확실하지 않은 경우 "상세 스펙 확인 요망" 경고.

            [INPUT]
            Motherboard Title: %s
            Memory Title: %s

            [OUTPUT JSON]
            {
              "result": "POSITIVE" | "NEGATIVE" | "WARNING",
              "errors": [],
              "warnings": [],
              "details": ""
            }
            """.formatted(mbTitle, ramTitle);
    }

    /**
     * 3. 메모리 속도 호환성 프롬프트 생성
     */
    public String buildMemorySpeedPrompt(String mbTitle, String ramTitle) {
        return COMMON_SYSTEM_PROMPT + """

            [ROLE]
            너는 메모리 동작 속도 및 성능 효율성 분석가다.

            [TASK]
            메모리의 최대 속도(MHz)와 메인보드 칩셋 등급을 비교하여 실제 성능 발휘 여부를 판단하라.

            [JUDGMENT CRITERIA]
            1. POSITIVE (정상):
               - 메인보드가 메모리의 스펙상 속도(XMP/EXPO 포함)를 지원함.
               - JEDEC 표준 클럭(3200, 4800, 5600MHz)인 경우.
            2. NEGATIVE (호환 불가):
               - 일반 데스크탑 보드에 서버용(ECC/REG) 메모리 장착 시도.
            3. WARNING (성능 저하):
               - 호환은 되지만 메인보드 제약(예: 인텔 H610 칩셋)으로 인해 고클럭 튜닝 램(예: 6000MHz 이상)이 기본 클럭으로 다운그레이드되어 동작하는 경우.
               - 메시지 예시: "장착은 가능하지만, 선택하신 메인보드는 메모리 오버클럭을 지원하지 않아 램 성능을 100%% 쓸 수 없습니다."

            [INPUT]
            Motherboard Title: %s
            Memory Title: %s

            [OUTPUT JSON]
            {
              "result": "POSITIVE" | "NEGATIVE" | "WARNING",
              "errors": [],
              "warnings": [],
              "details": ""
            }
            """.formatted(mbTitle, ramTitle);
    }

    /**
     * 4. 메인보드 ↔ 케이스 폼팩 호환성 프롬프트 생성
     */
    public String buildMotherboardCaseFormFactorPrompt(String mbTitle, String caseTitle) {
        return COMMON_SYSTEM_PROMPT + """

            [ROLE]
            너는 PC 조립성 및 I/O 포트 호환성 분석 엔지니어다.

            [TASK]
            1. 케이스 내부 공간과 메인보드 크기(폼팩터)를 비교한다.
            2. 케이스 전면 USB-C 포트 지원 여부와 메인보드 내부 헤더를 확인한다.

            [JUDGMENT CRITERIA]
            1. POSITIVE (정상):
               - 케이스 지원 규격 >= 메인보드 규격 (예: 미들타워 ATX 케이스 ↔ mATX 보드).
               - 케이스 전면 포트와 메인보드 헤더가 매칭됨.
            2. NEGATIVE (호환 불가):
               - 케이스가 작아서 메인보드가 안 들어감 (예: 미니타워 ↔ ATX 보드).
            3. WARNING (기능 제한):
               - 물리적 장착은 가능하나, 케이스에는 'USB Type-C' 포트가 있는데 메인보드(주로 저가형)에는 연결할 'Type-E(C타입 내부 헤더)'가 없는 경우.
               - 메시지 예시: "조립은 가능하지만, 메인보드에 단자가 없어 케이스 전면 C타입 포트를 사용할 수 없습니다."

            [INPUT]
            Motherboard Title: %s
            Case Title: %s

            [OUTPUT JSON]
            {
              "result": "POSITIVE" | "NEGATIVE" | "WARNING",
              "errors": [],
              "warnings": [],
              "details": ""
            }
            """.formatted(mbTitle, caseTitle);
    }

    /**
     * 5. GPU ↔ 케이스 호환성 프롬프트 생성
     */
    public String buildGpuCasePrompt(String gpuTitle, String caseTitle) {
        return COMMON_SYSTEM_PROMPT + """

            [ROLE]
            너는 그래픽카드와 케이스의 물리적 간섭 여부를 판단하는 분석기다.

            [TASK]
            GPU의 대략적인 길이(팬 개수 및 등급 기반 추론)와 케이스의 GPU 허용 길이를 비교하라. 정확한 수치가 없을 때는 보수적으로 판단하라.

            [JUDGMENT CRITERIA]
            1. POSITIVE (정상):
               - 케이스가 넉넉한 공간(미들타워 이상)이며 GPU가 표준 사이즈일 때.
               - 추론된 GPU 길이보다 케이스 허용 길이가 여유 있을 때.
            2. NEGATIVE (호환 불가):
               - 명백한 장착 불가 (예: 슬림/LP형 케이스 ↔ 일반 그래픽카드).
               - 초소형 ITX 케이스 ↔ 3팬 대형 그래픽카드.
            3. WARNING (주의):
               - 장착 가능성이 반반이거나 여유 공간이 매우 빡빡할 것으로 예상되는 경우 (예: 미니타워 ↔ 3팬 그래픽카드).
               - 메시지 예시: "그래픽카드가 커서 케이스에 꽉 낄 수 있습니다. 케이스 제조사 정보를 통해 GPU 허용 길이를 반드시 실측해보세요."

            [INPUT]
            GPU Title: %s
            Case Title: %s

            [OUTPUT JSON]
            {
              "result": "POSITIVE" | "NEGATIVE" | "WARNING",
              "errors": [],
              "warnings": [],
              "details": ""
            }
            """.formatted(gpuTitle, caseTitle);
    }

    /**
     * 6. 전력 안정성 프롬프트 생성
     */
    public String buildPowerStabilityPrompt(String cpuTitle, String gpuTitle, String psuTitle) {
        return COMMON_SYSTEM_PROMPT + """

            [ROLE]
            너는 PC 전력 소비량 및 파워 안정성 분석가다.

            [TASK]
            CPU와 GPU의 모델명을 통해 피크 TDP를 추산하고, 파워서플라이 용량과 비교하라.

            [JUDGMENT CRITERIA]
            1. POSITIVE (정상):
               - 파워 용량 >= (CPU TDP + GPU TDP + 200W 여유분).
               - 해당 하드웨어 등급의 권장 파워 용량을 충족함.
            2. NEGATIVE (호환 불가/위험):
               - 파워 용량 < (CPU TDP + GPU TDP). 부팅 불가 또는 셧다운 위험.
            3. WARNING (여유 부족):
               - 이론상 작동은 하나 여유 전력이 거의 없는 경우 (예: 권장 750W 시스템에 600W 파워).
               - 메시지 예시: "파워 용량이 부족할 수 있습니다. 안정적인 사용을 위해 한 단계 높은 용량을 권장합니다."

            [INPUT]
            CPU Title: %s
            GPU Title: %s
            PSU Title: %s

            [OUTPUT JSON]
            {
              "result": "POSITIVE" | "NEGATIVE" | "WARNING",
              "errors": [],
              "warnings": [],
              "details": ""
            }
            """.formatted(cpuTitle, gpuTitle, psuTitle);
    }

    /**
     * 7. 파워 커넥터 호환성 프롬프트 생성
     */
    public String buildPowerConnectorPrompt(String gpuTitle, String psuTitle) {
        return COMMON_SYSTEM_PROMPT + """

            [ROLE]
            너는 파워서플라이 케이블 규격 및 커넥터 매칭 전문가다.

            [TASK]
            GPU 구동에 필요한 보조 전원 커넥터 구성과 파워의 지원 규격(ATX 3.0 등)을 확인하라.

            [JUDGMENT CRITERIA]
            1. POSITIVE (정상):
               - 파워가 ATX 3.0/3.1 규격이거나, 필요한 8핀 케이블 개수가 충분함.
            2. NEGATIVE (호환 불가):
               - 특수 규격 파워(TFX, 서버용)라 그래픽카드용 보조전원 케이블이 없는 경우.
            3. WARNING (젠더/변환 필요):
               - GPU는 12VHPWR(16핀)을 사용하는데(예: RTX 4070 Ti 이상), 파워는 구형(ATX 2.0)인 경우.
               - 메시지 예시: "선택하신 파워는 최신 그래픽카드용 16핀 케이블이 없어 변환 젠더를 주렁주렁 연결해야 합니다. 선정리가 어렵고 안정성이 떨어질 수 있으니 ATX 3.0 파워를 추천합니다."

            [INPUT]
            GPU Title: %s
            PSU Title: %s

            [OUTPUT JSON]
            {
              "result": "POSITIVE" | "NEGATIVE" | "WARNING",
              "errors": [],
              "warnings": [],
              "details": ""
            }
            """.formatted(gpuTitle, psuTitle);
    }

    /**
     * 8. 스토리지 호환성 프롬프트 생성
     */
    public String buildStoragePrompt(String mbTitle, String storageTitle) {
        return COMMON_SYSTEM_PROMPT + """

            [ROLE]
            너는 스토리지 인터페이스 및 슬롯 호환성 분석가다.

            [TASK]
            메인보드의 M.2/SATA 슬롯 지원 여부와 스토리지 인터페이스를 대조하라.

            [JUDGMENT CRITERIA]
            1. POSITIVE (정상):
               - 메인보드에 해당 규격(M.2 NVMe 또는 SATA) 슬롯이 존재함.
            2. NEGATIVE (호환 불가):
               - 물리적 슬롯 부재 (예: M.2 슬롯 없는 구형 보드 ↔ NVMe SSD).
            3. WARNING (속도 제한):
               - 장착은 되나 속도 저하 발생 (예: PCIe 4.0 SSD ↔ PCIe 3.0 지원 보드).
               - 메시지 예시: "장착은 가능하지만, 메인보드가 구형이라 SSD의 최대 속도를 낼 수 없습니다."

            [INPUT]
            Motherboard Title: %s
            Storage Title: %s

            [OUTPUT JSON]
            {
              "result": "POSITIVE" | "NEGATIVE" | "WARNING",
              "errors": [],
              "warnings": [],
              "details": ""
            }
            """.formatted(mbTitle, storageTitle);
    }

    /**
     * 9. CPU 쿨러 ↔ 케이스/램 호환성 프롬프트 생성
     */
    public String buildCoolerCompatibilityPrompt(String coolerTitle, String caseTitle, String ramTitle) {
        return COMMON_SYSTEM_PROMPT + """

            [ROLE]
            너는 쿨링 시스템 물리 간섭 분석가다. (높이 및 램 간섭 체크)

            [TASK]
            1. 쿨러 높이(공랭) 또는 라디에이터 크기(수랭)가 케이스에 맞는지 확인하라.
            2. 대형 공랭 쿨러의 경우, 튜닝 램과의 간섭 가능성을 예측하라.

            [JUDGMENT CRITERIA]
            1. POSITIVE (정상):
               - 쿨러 높이가 케이스 허용 범위 내이며, 간섭 이슈가 없음.
            2. NEGATIVE (호환 불가):
               - 공랭 쿨러가 너무 높아 케이스가 닫히지 않음.
               - 수랭 라디에이터(360mm 등)를 케이스가 지원하지 않음.
            3. WARNING (램 간섭/불확실):
               - "대형 공랭 쿨러(듀얼 타워)" + "방열판 있는 높은 튜닝 램" 조합.
               - 메시지 예시: "선택하신 쿨러는 덩치가 커서 튜닝 램과 부딪힐 수 있습니다. 램을 낮은 제품으로 바꾸거나 쿨러 팬 위치를 조정해야 할 수도 있습니다."

            [INPUT]
            Cooler Title: %s
            Case Title: %s
            Memory Title: %s

            [OUTPUT JSON]
            {
              "result": "POSITIVE" | "NEGATIVE" | "WARNING",
              "errors": [],
              "warnings": [],
              "details": ""
            }
            """.formatted(coolerTitle, caseTitle, ramTitle);
    }

    /**
     * 10. OS/드라이버 호환성 프롬프트 생성
     */
    public String buildOsCompatibilityPrompt(String cpuTitle, String osTitle) {
        return COMMON_SYSTEM_PROMPT + """

            [ROLE]
            너는 OS 및 소프트웨어 최적화 컨설턴트다.

            [TASK]
            CPU 아키텍처(특히 인텔 하이브리드 아키텍처)에 따른 적절한 OS 버전을 판단하라.

            [JUDGMENT CRITERIA]
            1. POSITIVE (정상):
               - 하드웨어 성능을 온전히 지원하는 OS (예: 인텔 12세대+ ↔ Windows 11).
               - 구형 하드웨어 ↔ Windows 10.
            2. NEGATIVE (호환 불가):
               - 최신 하드웨어에 드라이버 지원이 끊긴 구형 OS 설치 시도 (예: 라이젠 7000번대 ↔ Windows 7).
            3. WARNING (성능 저하):
               - 인텔 12/13/14세대 (P코어+E코어) CPU에 Windows 10 사용 시.
               - 메시지 예시: "인텔 최신 CPU는 Windows 11을 사용해야 P코어와 E코어를 효율적으로 사용하여 제 성능을 낼 수 있습니다. Windows 10은 권장하지 않습니다."

            [INPUT]
            CPU Title: %s
            OS Title: %s

            [OUTPUT JSON]
            {
              "result": "POSITIVE" | "NEGATIVE" | "WARNING",
              "errors": [],
              "warnings": [],
              "details": ""
            }
            """.formatted(cpuTitle, osTitle);
    }

    /**
     * Gemini API 응답을 CompatibilityCheckResultDto로 파싱
     */
    public CompatibilityCheckResultDto parseCompatibilityResponse(
            String response, int checkId, String checkName
    ) {
        try {
            // JSON 마크다운 제거 (```json ... ``` 형태일 수 있음)
            String jsonString = response.trim();
            if (jsonString.startsWith("```json")) {
                jsonString = jsonString.substring(7);
            }
            if (jsonString.startsWith("```")) {
                jsonString = jsonString.substring(3);
            }
            if (jsonString.endsWith("```")) {
                jsonString = jsonString.substring(0, jsonString.length() - 3);
            }
            jsonString = jsonString.trim();

            JsonNode jsonNode = objectMapper.readTree(jsonString);

            String result = jsonNode.has("result") 
                    ? jsonNode.get("result").asText().toUpperCase() 
                    : "UNKNOWN";

            List<String> errors = new ArrayList<>();
            if (jsonNode.has("errors") && jsonNode.get("errors").isArray()) {
                for (JsonNode error : jsonNode.get("errors")) {
                    errors.add(error.asText());
                }
            }

            List<String> warnings = new ArrayList<>();
            if (jsonNode.has("warnings") && jsonNode.get("warnings").isArray()) {
                for (JsonNode warning : jsonNode.get("warnings")) {
                    warnings.add(warning.asText());
                }
            }

            String details = jsonNode.has("details") 
                    ? jsonNode.get("details").asText() 
                    : "";

            return CompatibilityCheckResultDto.builder()
                    .checkId(checkId)
                    .checkName(checkName)
                    .status("COMPLETED")
                    .result(result)
                    .errors(errors)
                    .warnings(warnings)
                    .details(details)
                    .build();

        } catch (JsonProcessingException e) {
            log.error("JSON 파싱 실패: {}", response, e);
            return CompatibilityCheckResultDto.builder()
                    .checkId(checkId)
                    .checkName(checkName)
                    .status("ERROR")
                    .result("UNKNOWN")
                    .errors(List.of("응답 파싱 중 오류가 발생했습니다."))
                    .warnings(List.of())
                    .details("")
                    .build();
        }
    }
}

