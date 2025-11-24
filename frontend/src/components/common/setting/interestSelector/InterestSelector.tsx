import style from "./interestSelector.module.css";
import InterestButton from "../InterestButton/InterestButton";
import CustomInterest from "../CustomInterest/CustomInterest";
import AddInterestButton from "../AddInterestButton/AddInterestButton";
import { useState, useEffect } from "react";
import { useProfileSetupStore } from "../../../../stores/useProfileSetupStore";

// 관심사 데이터
const data: InterestItem[] = [
  { id: 1, interest: "게임" },
  { id: 2, interest: "프로그래밍" },
  { id: 3, interest: "디자인" },
  { id: 4, interest: "영상 편집" },
  { id: 5, interest: "음악" },
  { id: 6, interest: "사진" },
  { id: 7, interest: "3D 모델링" },
  { id: 8, interest: "문서 작업" },
  { id: 9, interest: "데이터 분석" },
  { id: 10, interest: "AI/머신러닝" },
];

type InterestItem = {
  id: number;
  interest: string;
};

interface InterestSelectorProps {
  count: number;
  setCount: (count: number) => void;
}

export default function InterestSelector({
  count,
  setCount,
}: InterestSelectorProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isAdded, setIsAdded] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [customInterests, setCustomInterests] = useState<string[]>([]);

  const { setTempInterestIds, setTempCustomInterests } = useProfileSetupStore();

  // 관심사 ID를 찾는 헬퍼 함수
  const getInterestId = (interestName: string): number | null => {
    const found = data.find(
      (item: InterestItem) => item.interest === interestName
    );
    return found ? found.id : null;
  };

  // 선택된 관심사가 변경될 때마다 store 업데이트
  useEffect(() => {
    const interestIds: number[] = [];
    const customInterestsList: string[] = [];

    selectedInterests.forEach((interest) => {
      const id = getInterestId(interest);
      if (id !== null) {
        // 기본 관심사인 경우
        interestIds.push(id);
      } else {
        // 사용자 정의 관심사인 경우
        customInterestsList.push(interest);
      }
    });

    setTempInterestIds(interestIds);
    setTempCustomInterests(customInterestsList);
  }, [selectedInterests, setTempInterestIds, setTempCustomInterests]);

  const handleClick = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest)
      );
      setCount(count - 1);
    } else {
      setSelectedInterests([...selectedInterests, interest]);
      setCount(count + 1);
    }
  };

  const handleConfirm = () => {
    if (newInterest.trim() !== "") {
      setCustomInterests([...customInterests, newInterest.trim()]);
      setSelectedInterests([...selectedInterests, newInterest.trim()]);
      setNewInterest("");
      setIsAdded(false);
      setCount(count + 1);
    }
  };

  const handleCancel = () => {
    setNewInterest("");
    setIsAdded(false);
  };

  return (
    <div className={style.container}>
      {data.map((interestItem: InterestItem) => (
        <InterestButton
          key={`interest-${interestItem.id}`}
          onClick={() => handleClick(interestItem.interest)}
          selected={selectedInterests.includes(interestItem.interest)}
        >
          <div className={style.inputContainer}>{interestItem.interest}</div>
        </InterestButton>
      ))}
      {customInterests.map((interest: string, index: number) => (
        <InterestButton
          key={`custom-${index}-${interest}`}
          onClick={() => handleClick(interest)}
          selected={selectedInterests.includes(interest)}
        >
          <div className={style.inputContainer}>{interest}</div>
        </InterestButton>
      ))}

      {isAdded ? (
        <InterestButton onClick={() => {}} selected={true}>
          <CustomInterest
            value={newInterest}
            onChange={setNewInterest}
            handleConfirm={handleConfirm}
            handleCancel={handleCancel}
          />
        </InterestButton>
      ) : (
        <AddInterestButton onClick={() => setIsAdded(true)} />
      )}
    </div>
  );
}
