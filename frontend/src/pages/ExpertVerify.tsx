import ExpertVerifyLayout from "@/components/layout/ExpertVerifyLayout";
import SettingProtectedRoute from "@/routes/SettingProtectedRoute";

export const ExpertVerify = () => {
  return (
    <SettingProtectedRoute>
      <ExpertVerifyLayout />
    </SettingProtectedRoute>
  );
};
