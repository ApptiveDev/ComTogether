// 헬퍼 함수들
export function getLoadingText(step: string): string {
  switch (step) {
    case "starting":
      return "로그인을 시작합니다...";
    case "authenticating":
      return "카카오 인증을 확인하고 있습니다...";
    case "fetchingUser":
      return "사용자 정보를 가져오고 있습니다...";
    case "completed":
      return "로그인이 완료되었습니다!";
    case "success":
      return "로그인 성공! 페이지를 이동합니다...";
    case "error":
      return "오류가 발생했습니다.";
    default:
      return "처리 중입니다...";
  }
}

export function getStepClass(currentStep: string, targetStep: string): string {
  const stepOrder = ["starting", "authenticating", "fetchingUser", "completed"];
  const currentIndex = stepOrder.indexOf(currentStep);
  const targetIndex = stepOrder.indexOf(targetStep);

  if (currentIndex > targetIndex) return "completed";
  if (currentIndex === targetIndex) return "active";
  return "";
}

export type RedirectStep = "starting" | "authenticating" | "fetchingUser" | "completed" | "success" | "error";