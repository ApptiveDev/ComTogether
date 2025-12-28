export type Consultation = {
  id: number;
  title: string;
  date: string;
  expertName: string;
};

export const consultationMock: Consultation[] = [
  {
    id: 1,
    title: "[게이밍 PC 견적 (RTX 4070)]에 대한 상담",
    date: "2025-12-10",
    expertName: "박전문",
  },
  {
    id: 2,
    title: "[사무용 PC 견적]에 대한 상담",
    date: "2025-12-08",
    expertName: "김전문",
  },
  {
    id: 3,
    title: "[영상 편집용 PC 견적]에 대한 상담",
    date: "2025-11-30",
    expertName: "이전문",
  },
];
