import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import styles from "./interestSection.module.css";
import InterestTag from "./InterestTag";
import type { UserInterest } from "@/types/user";
import modelingIcon from "@/assets/image/modeling.svg";
import designIcon from "@/assets/image/design.svg";
import videoIcon from "@/assets/image/video.svg";
import { interestMock } from "./mock";
import { useUpdateInterests } from "@/api/User/useUpdateInterests";

type InterestSectionProps = {
  interests?: UserInterest[];
  isLoading?: boolean;
  hasError?: boolean;
};

type DisplayInterest = {
  key: string | number;
  label: string;
  icon?: string;
};

const ICON_MAP: Record<string, string> = {
  "3D모델링": modelingIcon,
  "3D 모델링": modelingIcon,
  "3D": modelingIcon,
  디자인: designIcon,
  영상편집: videoIcon,
  "영상 편집": videoIcon,
};

const iconFromLabel = (label?: string | null): string | undefined => {
  if (!label) return undefined;
  return ICON_MAP[label];
};

const normalizeLabel = (label: string): string =>
  label.trim().toLowerCase().replace(/\s+/g, "");

const sortStrings = (values: string[]) =>
  [...values].map((v) => v.trim()).sort((a, b) => a.localeCompare(b));

const areArraysEqual = <T,>(a: T[], b: T[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

export default function InterestSection({
  interests = [],
  isLoading,
  hasError,
}: InterestSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingInterests, setEditingInterests] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateInterests = useUpdateInterests();

  // 서버에서 받아온 관심사 이름 목록
  const serverInterestNames = useMemo(() => {
    return interests
      .map((i) => i.name?.trim())
      .filter((name): name is string => !!name);
  }, [interests]);

  // 편집 모드 진입 시 서버 데이터로 초기화
  useEffect(() => {
    if (!isEditing) {
      setEditingInterests(serverInterestNames);
    }
  }, [serverInterestNames, isEditing]);

  // 로딩/에러 시 편집 모드 종료
  useEffect(() => {
    if ((isLoading || hasError) && isEditing) {
      setIsEditing(false);
    }
  }, [hasError, isEditing, isLoading]);

  const hasChanges = useMemo(() => {
    const base = sortStrings(serverInterestNames);
    const next = sortStrings(editingInterests);
    return !areArraysEqual(base, next);
  }, [serverInterestNames, editingInterests]);

  const handleAddCustom = () => {
    const value = customInput.trim();
    if (!value) return;

    // 중복 체크 (대소문자, 공백 무시)
    const exists = editingInterests.some(
      (item) => normalizeLabel(item) === normalizeLabel(value)
    );

    if (exists) {
      setCustomInput("");
      return;
    }

    setEditingInterests((prev) => [...prev, value]);
    setCustomInput("");
  };

  const handleRemoveInterest = (label: string) => {
    setEditingInterests((prev) => prev.filter((item) => item !== label));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrorMessage(null);
    setEditingInterests(serverInterestNames);
    setCustomInput("");
  };

  const handleSave = () => {
    if (updateInterests.isPending) return;

    console.log("=== 관심사 저장 요청 ===");
    console.log("저장할 관심사:", editingInterests);

    setErrorMessage(null);
    updateInterests.mutate(
      {
        // 모든 관심사를 custom_interests로 전송
        custom_interests: editingInterests,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: (error) => {
          setErrorMessage(error.message || "관심사 저장에 실패했습니다.");
        },
      }
    );
  };

  // 표시용 관심사 목록
  const displayInterests = useMemo<DisplayInterest[]>(() => {
    if (interests.length === 0) {
      // 관심사가 없으면 mock 데이터 표시
      return interestMock.map((item) => ({
        key: item.id,
        label: item.label,
        icon: item.icon,
      }));
    }

    return interests
      .filter((i) => i.name?.trim())
      .map((interest) => ({
        key: interest.interestId ?? `custom-${interest.name}`,
        label: interest.name,
        icon: iconFromLabel(interest.name),
      }));
  }, [interests]);

  const showEditActions = !isLoading && !hasError;
  const saveDisabled =
    updateInterests.isPending || !hasChanges || editingInterests.length === 0;

  let content: ReactNode;

  if (isLoading) {
    content = <p className={styles.state}>관심사를 불러오는 중이에요...</p>;
  } else if (hasError) {
    content = <p className={styles.state}>관심사를 불러오지 못했어요.</p>;
  } else if (isEditing) {
    content = (
      <div className={styles.editor}>
        {/* 현재 관심사 목록 (삭제 가능) */}
        {editingInterests.length > 0 && (
          <div className={styles.customList}>
            {editingInterests.map((label) => (
              <InterestTag
                key={`edit-${label}`}
                label={label}
                icon={iconFromLabel(label)}
                onRemove={() => handleRemoveInterest(label)}
              />
            ))}
          </div>
        )}

        {/* 관심사 추가 입력 */}
        <div className={styles.customInputRow}>
          <input
            className={styles.customInput}
            placeholder="관심사를 입력해주세요"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustom();
              }
            }}
            maxLength={20}
          />
          <button
            type="button"
            className={styles.customAddButton}
            onClick={handleAddCustom}
            disabled={!customInput.trim()}
          >
            추가
          </button>
        </div>

        <div className={styles.editorFooter}>
          <span className={styles.selectionInfo}>
            {editingInterests.length}개 선택됨
          </span>

          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancelEdit}
              disabled={updateInterests.isPending}
            >
              취소
            </button>
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSave}
              disabled={saveDisabled}
            >
              {updateInterests.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>

        {errorMessage && <p className={styles.errorAlert}>{errorMessage}</p>}
      </div>
    );
  } else {
    content = (
      <div className={styles.section}>
        {displayInterests.map((item) => (
          <InterestTag key={item.key} icon={item.icon} label={item.label} />
        ))}
      </div>
    );
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <p className={styles.title}>관심사</p>
          <p className={styles.subtitle}>나의 관심 분야를 관리해 보세요</p>
        </div>
        {showEditActions && (
          <div className={styles.headerActions}>
            {!isEditing && (
              <button
                type="button"
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                수정
              </button>
            )}
            {isEditing && (
              <button
                type="button"
                className={styles.editButton}
                onClick={handleCancelEdit}
                disabled={updateInterests.isPending}
              >
                편집 닫기
              </button>
            )}
          </div>
        )}
      </div>
      {content}
    </section>
  );
}
