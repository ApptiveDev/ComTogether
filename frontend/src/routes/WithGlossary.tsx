import { Outlet } from "react-router-dom";
import GlossaryLayout from "../components/layout/GlossaryLayout";

/**
 * Glossary 아이콘을 표시할 페이지들을 위한 래퍼 컴포넌트
 * 중첩 라우트로 사용하여 특정 페이지에만 Glossary를 표시
 */
export const WithGlossary = () => {
  return (
    <>
      <Outlet />
      <GlossaryLayout />
    </>
  );
};
