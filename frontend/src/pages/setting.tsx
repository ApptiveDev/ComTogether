import SettingLayout from "../components/layout/settingLayout";
import SettingProtectedRoute from "../components/common/SettingProtectedRoute";

export default function Setting() {
  return (
    <SettingProtectedRoute>
      <SettingLayout />
    </SettingProtectedRoute>
  );
}
