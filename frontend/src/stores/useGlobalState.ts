// src/stores/useGlobalState.ts - 전역 UI 상태 관리
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GlobalState {
  // 로딩 상태
  isGlobalLoading: boolean;
  loadingMessage?: string;
  
  // 에러 상태
  globalError?: string;
  
  // 토스트/알림 상태
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
  
  // 모달 상태
  modals: Record<string, { isOpen: boolean; data?: unknown }>;
  
  // 액션들
  setGlobalLoading: (isLoading: boolean, message?: string) => void;
  setGlobalError: (error?: string) => void;
  addToast: (toast: Omit<GlobalState['toasts'][0], 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  openModal: (id: string, data?: unknown) => void;
  closeModal: (id: string) => void;
  clearError: () => void;
}

export const useGlobalState = create<GlobalState>()(
  devtools(
    (set, get) => ({
      isGlobalLoading: false,
      loadingMessage: undefined,
      globalError: undefined,
      toasts: [],
      modals: {},
      
      setGlobalLoading: (isLoading, message) => 
        set({ isGlobalLoading: isLoading, loadingMessage: message }),
      
      setGlobalError: (error) => 
        set({ globalError: error }),
      
      clearError: () => 
        set({ globalError: undefined }),
      
      addToast: (toast) => {
        const id = Date.now().toString();
        const newToast = { ...toast, id };
        
        set(state => ({ 
          toasts: [...state.toasts, newToast] 
        }));
        
        // 자동 제거 (기본 5초)
        const duration = toast.duration ?? 5000;
        if (duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, duration);
        }
      },
      
      removeToast: (id) => 
        set(state => ({ 
          toasts: state.toasts.filter(toast => toast.id !== id) 
        })),
      
      clearToasts: () => 
        set({ toasts: [] }),
      
      openModal: (id, data) => 
        set(state => ({ 
          modals: { 
            ...state.modals, 
            [id]: { isOpen: true, data } 
          } 
        })),
      
      closeModal: (id) => 
        set(state => ({ 
          modals: { 
            ...state.modals, 
            [id]: { isOpen: false } 
          } 
        })),
    }),
    { name: 'global-state' }
  )
);