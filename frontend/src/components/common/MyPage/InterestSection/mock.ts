import modelingIcon from "@/assets/image/modeling.svg";
import designIcon from "@/assets/image/design.svg";
import videoIcon from "@/assets/image/video.svg";

export type Interest = {
  id: number;
  label: string;
  icon: string;
};

export const interestMock: Interest[] = [
  {
    id: 1,
    label: "3D모델링",
    icon: modelingIcon,
  },
  {
    id: 2,
    label: "디자인",
    icon: designIcon,
  },
  {
    id: 3,
    label: "영상편집",
    icon: videoIcon,
  },
];
