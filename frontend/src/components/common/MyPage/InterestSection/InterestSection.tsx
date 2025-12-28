import { useState } from "react";
import styles from "./interestSection.module.css";
import { interestMock, type Interest } from "./mock";
import InterestTag from "./InterestTag";

export default function InterestSection() {
  const [interests, setInterests] = useState<Interest[]>(interestMock);

  const handleRemove = (id: number) => {
    setInterests((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={styles.section}>
      {interests.map((item) => (
        <InterestTag
          key={item.id}
          icon={item.icon}
          label={item.label}
          onRemove={() => handleRemove(item.id)}
        />
      ))}
    </div>
  );
}
