import { useState, useRef, type DragEvent, type ChangeEvent } from "react";

interface FileUploadOptions {
  maxSizeInMB?: number;
  acceptedTypes?: string[];
  onFileSelect?: (file: File) => void;
}

interface FileUploadState {
  selectedFile: File | null;
  previewUrl: string | null;
  isDragOver: boolean;
  error: string | null;
}

export function useFileUpload(options: FileUploadOptions = {}) {
  const {
    maxSizeInMB = 10,
    acceptedTypes = ["image/"],
    onFileSelect,
  } = options;

  const [state, setState] = useState<FileUploadState>({
    selectedFile: null,
    previewUrl: null,
    isDragOver: false,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // 파일 타입 검증
    const isValidType = acceptedTypes.some((type) =>
      file.type.startsWith(type.replace("*", "").replace("/", ""))
    );

    if (!isValidType) {
      return "지원하지 않는 파일 형식입니다.";
    }

    // 파일 크기 검증
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return `파일 크기는 ${maxSizeInMB}MB 이하만 가능합니다.`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      setState((prev) => ({ ...prev, error: validationError }));
      return;
    }

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setState({
        selectedFile: file,
        previewUrl: e.target?.result as string,
        isDragOver: false,
        error: null,
      });
    };
    reader.readAsDataURL(file);

    // 부모 컴포넌트에 파일 전달
    onFileSelect?.(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isDragOver: true }));
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isDragOver: false }));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isDragOver: false }));

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
    setState({
      selectedFile: null,
      previewUrl: null,
      isDragOver: false,
      error: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return {
    // State
    selectedFile: state.selectedFile,
    previewUrl: state.previewUrl,
    isDragOver: state.isDragOver,
    error: state.error,
    
    // Refs
    fileInputRef,
    
    // Handlers
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleButtonClick,
    handleRemoveFile,
    clearError,
  };
}
