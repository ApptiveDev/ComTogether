import style from "./fileUploadBox.module.css";
import uploadIcon from "@/assets/image/upload.svg";
import Button from "../../Button/Button";
import { useFileUpload } from "@/hooks/useFileUpload";
import {
  useCertificationGenerate,
  useCertificationGet,
} from "@/api/Certification";
import { useGetPresignedUrl, uploadToS3 } from "@/api/services/uploadService";
import { useEffect, useState } from "react";

interface FileUploadBoxProps {
  onFileSelect?: (file: File) => void;
}

export default function FileUploadBox({ onFileSelect }: FileUploadBoxProps) {
  const [isUploading, setIsUploading] = useState(false);

  // 인증 목록 조회
  const { data: certifications } = useCertificationGet();

  // 승인 대기 중인 인증이 있는지 확인
  const hasPendingCertification = certifications?.some(
    (cert) => cert.status === "PENDING"
  );

  const {
    selectedFile,
    previewUrl,
    isDragOver,
    error,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleButtonClick,
    handleRemoveFile,
    clearError,
  } = useFileUpload({
    maxSizeInMB: 10,
    acceptedTypes: ["image/"],
    onFileSelect,
  });

  const { mutateAsync: getPresignedUrl } = useGetPresignedUrl();

  const { mutateAsync, isPending } = useCertificationGenerate({
    onSuccess: () => {
      alert("전문가 인증이 성공적으로 제출되었습니다!");
      handleRemoveFile();
      // 페이지 새로고침하여 승인 대기 중 UI 표시
      window.location.reload();
    },
    onError: (error) => {
      console.error("인증 제출 실패:", error);
      alert("제출에 실패했습니다. 다시 시도해주세요.");
    },
  });

  // 에러 메시지 표시
  useEffect(() => {
    if (error) {
      alert(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("먼저 인증서 이미지를 업로드해주세요.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Presigned URL 발급
      const fileExtension = selectedFile.name.split(".").pop() || "png";
      const presignedData = await getPresignedUrl({
        type: "CERTIFICATION",
        extension: fileExtension,
        content_type: selectedFile.type,
      });

      // 2. S3에 파일 업로드
      await uploadToS3(presignedData.upload_url, selectedFile);

      // 3. 인증서 생성
      await mutateAsync({ file_key: presignedData.file_key });
    } catch (error) {
      console.error("제출 실패:", error);

      let errorMessage = "제출에 실패했습니다. 다시 시도해주세요.";

      if (error instanceof Error) {
        // 네트워크 에러
        if (
          error.message.includes("Network Error") ||
          error.message.includes("ECONNREFUSED")
        ) {
          errorMessage =
            "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.";
        }
        // 파일 업로드 에러
        else if (error.message.includes("파일 업로드")) {
          errorMessage = "파일 업로드에 실패했습니다. 다시 시도해주세요.";
        }
        // 파일 크기 에러
        else if (
          error.message.includes("size") ||
          error.message.includes("크기")
        ) {
          errorMessage =
            "파일 크기가 너무 큽니다. 10MB 이하의 파일을 업로드해주세요.";
        }
      }

      // Axios 에러 처리
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } };
        };

        if (axiosError.response?.status === 401) {
          errorMessage = "로그인이 필요합니다. 다시 로그인해주세요.";
        } else if (axiosError.response?.status === 403) {
          errorMessage = "권한이 없습니다.";
        } else if (axiosError.response?.status === 500) {
          errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      alert(errorMessage);
    } finally {
      setIsUploading(false);
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

      {hasPendingCertification ? (
        <div className={style.pendingContainer}>
          <div className={style.pendingContent}>
            <h3>🕐 승인 대기 중</h3>
            <p>전문가 인증 요청이 검토 중입니다.</p>
            <p className={style.pendingSubtext}>
              관리자 승인 후 전문가 권한이 부여됩니다.
            </p>
          </div>
        </div>
      ) : previewUrl ? (
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
                content={
                  isUploading || isPending ? "제출 중..." : "인증서 제출"
                }
                onClick={handleSubmit}
                disabled={isUploading || isPending}
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
