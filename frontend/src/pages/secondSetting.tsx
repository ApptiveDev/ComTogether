import SecondSettingLayout from "../components/layout/secondSettingLayout";
import SettingProtectedRoute from "../routes/SettingProtectedRoute";

export default function SecondSetting() {
  return (
    <SettingProtectedRoute>
      <SecondSettingLayout />
    </SettingProtectedRoute>
  );
}
