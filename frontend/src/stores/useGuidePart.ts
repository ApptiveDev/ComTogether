import { create } from "zustand";

interface GuidePartState {
    currentStep: number;
    selectCategory: string;
    contentPart: string;
    showMore: boolean;
    setCurrentStep: (step: number) => void;
    setSelectCategory: (category: string) => void;
    setContentPart: (content: string) => void;
    setShowMore: (show: boolean) => void;
}

export const useGuidePart = create<GuidePartState>((set) => ({ 
    currentStep: 1,
    selectCategory: "CPU",
    contentPart: "개요",
    showMore: false,
    setCurrentStep: (step) => set({ currentStep: step }),
    setSelectCategory: (category) => set({ selectCategory: category }),
    setContentPart: (content) => set({ contentPart: content }),
    setShowMore: (show) => set({ showMore: show }),
}));
