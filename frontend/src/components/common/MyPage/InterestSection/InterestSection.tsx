import styles from "./interestSection.module.css";
import InterestTag from "./InterestTag";
import type { UserInterest } from "@/types/user";
import modelingIcon from "@/assets/image/modeling.svg";
import designIcon from "@/assets/image/design.svg";
import videoIcon from "@/assets/image/video.svg";
import { interestMock } from "./mock";

type InterestSectionProps = {
  interests?: UserInterest[];
  isLoading?: boolean;
  hasError?: boolean;
};

const ICON_MAP: Record<string, string> = {
  "3D모델링": modelingIcon,
  디자인: designIcon,
  영상편집: videoIcon,
};

export default function InterestSection({
  interests = [],
  isLoading,
  hasError,
}: InterestSectionProps) {
  if (isLoading) {
    return (
      <div className={styles.section}>
        <p className={styles.state}>관심사를 불러오는 중이에요...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={styles.section}>
        <p className={styles.state}>관심사를 불러오지 못했어요.</p>
      </div>
    );
  }

  const mappedInterests = interests.map((item) => ({
    key: item.interestId,
    label: item.name,
    icon: ICON_MAP[item.name],
  }));

  const fallbackInterests = interestMock.map((item) => ({
    key: item.id,
    label: item.label,
    icon: item.icon,
  }));

  const displayInterests =
    mappedInterests.length > 0 ? mappedInterests : fallbackInterests;

  return (
    <div className={styles.section}>
      {displayInterests.map((item) => (
        <InterestTag key={item.key} icon={item.icon} label={item.label} />
      ))}
    </div>
  );
}
