import SecondSettingLayout from "../components/layout/secondSettingLayout";
import SettingProtectedRoute from "../components/common/SettingProtectedRoute";

export default function SecondSetting() {
  return (
    <SettingProtectedRoute>
      <SecondSettingLayout />
    </SettingProtectedRoute>
  );
}
