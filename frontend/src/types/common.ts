// UI 컴포넌트 공통 타입
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type InputVariant = 'default' | 'filled';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'spinner' | 'pulse' | 'dots';
export type SpinnerSize = 'small' | 'medium' | 'large';

// 레이아웃 관련 타입
export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface BaseLayoutProps extends LayoutProps {
  showHeader?: boolean;
  containerClassName?: string;
}

export interface CenteredLayoutProps extends LayoutProps {
  showHeader?: boolean;
  title?: string;
  description?: string;
}

// 폼 관련 타입
export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface InputProps extends 
  React.InputHTMLAttributes<HTMLInputElement>, 
  FormFieldProps {
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// 모달 관련 타입
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
}

// 버튼 관련 타입
export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

// 기존 Button 컴포넌트 호환성을 위한 레거시 타입
export interface LegacyButtonProps extends ButtonProps {
  content: string;
  color: string;
  backgroundColor: string;
}

// 로딩 스피너 타입
export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: string;
  text?: string;
  variant?: SpinnerVariant;
}

// 헤더 관련 타입
export interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

// 사용자 관련 타입 (기존 user.ts와 통합 가능)
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: 'BEGINNER' | 'EXPERT';
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

// 페이지네이션 타입 (API 타입에서 통합됨)
// 기존 코드와의 호환성을 위해 re-export
export type { PaginationParams, PaginatedApiResponse as PaginatedResponse } from './api';