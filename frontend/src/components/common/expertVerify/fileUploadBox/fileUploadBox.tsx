import style from "./fileUploadBox.module.css";
import uploadIcon from "@/assets/image/upload.svg";
import Button from "../../Button/button";
// import { expertVerify } from "../../../../api/expertVerify"; // API 완성 후 사용
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

interface FileUploadBoxProps {
  onFileSelect?: (file: File) => void;
}

export default function FileUploadBox({ onFileSelect }: FileUploadBoxProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    // 이미지 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("파일 크기는 10MB 이하만 가능합니다.");
      return;
    }

    setSelectedFile(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 부모 컴포넌트에 파일 전달
    onFileSelect?.(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("먼저 인증서 이미지를 업로드해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 임시로 2초 대기 (API 호출 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: API 완성 후 아래 코드 활성화
      // await expertVerify({
      //   certification_file: selectedFile,
      //   certification: '전문가 인증서',
      // });

      alert("전문가 인증이 성공적으로 제출되었습니다!");

      // 성공 시 다음 페이지로 이동
      navigate("/second-setting"); // 또는 적절한 다음 페이지 경로
    } catch (error) {
      console.error("제출 실패:", error);
      alert("제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`${style.boxContainer} ${isDragOver ? style.dragOver : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />

      {previewUrl ? (
        <div className={style.previewContainer}>
          <img src={previewUrl} alt="Preview" className={style.previewImage} />
          <div className={style.fileInfo}>
            <div className={style.fileName}>{selectedFile?.name}</div>
            <div className={style.fileSize}>
              {(selectedFile!.size / (1024 * 1024)).toFixed(2)} MB
            </div>
            <div className={style.buttonGroup}>
              <Button
                color="white"
                backgroundColor="#ff5525"
                content="다른 파일 선택"
                onClick={handleButtonClick}
              />
              <Button
                color="white"
                backgroundColor="#28a745"
                content={isSubmitting ? "제출 중..." : "인증서 제출"}
                onClick={handleSubmit}
                disabled={isSubmitting}
              />
            </div>
            <button className={style.removeButton} onClick={handleRemoveFile}>
              파일 제거
            </button>
          </div>
        </div>
      ) : (
        <>
          <img src={uploadIcon} alt="upload-icon" />
          <div className={style.content}>
            <div className={style["upload-instruction"]}>
              이미지를 드래그 또는 업로드해주세요
            </div>
            <Button
              color="white"
              backgroundColor="#ff5525"
              content="파일 선택하기"
              onClick={handleButtonClick}
            />
            <div className={style.fileLimit}>
              지원형식 : JPG, PNG, GIF, WEBP (최대 10MB)
            </div>
          </div>
        </>
      )}
    </div>
  );
}
