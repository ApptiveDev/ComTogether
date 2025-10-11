import { create } from "zustand";

interface GuidePartState {
    currentStep: number;
    selectCategory: string;
    contentPart: string;
    setCurrentStep: (step: number) => void;
    setSelectCategory: (category: string) => void;
    setContentPart: (content: string) => void;
}

export const useGuidePart = create<GuidePartState>((set) => ({ 
    currentStep: 1,
    selectCategory: "CPU",
    contentPart: "개요",
    setCurrentStep: (step) => set({ currentStep: step }),
    setSelectCategory: (category) => set({ selectCategory: category }),
    setContentPart: (content) => set({ contentPart: content }),
}));
