import CenteredLayout from "./base/CenteredLayout";
import InstructionBox from "../common/ExpertVerify/InstructionBox/InstructionBox";
import FileUploadBox from "../common/ExpertVerify/FileUploadBox/FileUploadBox";
import styles from "./expertVerifyLayout.module.css";

export default function ExpertVerifyLayout() {
  const instructionItems = [
    "컴퓨터공학 관련 학위증명서",
    "IT 관련 자격증 (정보처리기사, 컴활 등)",
    "PC 조립/수리 관련 경력증명서",
    "IT 기업 재직증명서",
    "관련 업종 사업자등록증",
  ];

  return (
    <CenteredLayout
      title="전문가 인증"
      description="전문가임을 인증할 수 있는 다음 중 하나의 문서를 첨부해주세요."
    >
      <div className={styles.content}>
        <InstructionBox items={instructionItems} />
        <FileUploadBox />
      </div>
    </CenteredLayout>
  );
}
