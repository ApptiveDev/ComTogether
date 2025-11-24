import { create } from 'zustand';
import type { item } from '@/types/compability';

interface PartState{
    currentCategory: string;
    currentPage: number;
    searchResult: item[];
    inputValue: string;
    setCurrentCategory: (category: string) => void;
    setCurrentPage: (page: number) => void;
    setSearchResult: (result: item[]) => void;
    setInputValue: (input: string) => void;
}

export const usePartListStore = create<PartState>((set)=>({
    currentCategory: "CPU",
    currentPage: 1,
    searchResult: [],
    inputValue: "",
    setCurrentCategory: (category) => set({currentCategory: category}),
    setCurrentPage: (page) => set({currentPage: page}),
    setSearchResult: (result) => set({searchResult: result}),
    setInputValue: (input) => set({inputValue: input})
}))
