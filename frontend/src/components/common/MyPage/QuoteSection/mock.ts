export type Quote = {
  id: number;
  title: string;
  date: string;
  compatibilityStatus: "DONE" | "PENDING";
};

export const quoteMock: Quote[] = [
  {
    id: 1,
    title: "사무용 PC 견적",
    date: "2025-12-10",
    compatibilityStatus: "DONE",
  },
  {
    id: 2,
    title: "게이밍 PC 견적 (RTX 4070)",
    date: "2025-12-10",
    compatibilityStatus: "PENDING",
  },
  {
    id: 3,
    title: "영상 편집용 PC 견적",
    date: "2025-11-03",
    compatibilityStatus: "DONE",
  },
];
