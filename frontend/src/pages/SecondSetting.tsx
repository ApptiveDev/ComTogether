import SecondSettingLayout from "../components/layout/SecondSettingLayout";
import SettingProtectedRoute from "../routes/SettingProtectedRoute";

export default function SecondSetting() {
  return (
    <SettingProtectedRoute>
      <SecondSettingLayout />
    </SettingProtectedRoute>
  );
}
