import SettingLayout from "../components/layout/settingLayout";
import SettingProtectedRoute from "../routes/SettingProtectedRoute";

export default function Setting() {
  return (
    <SettingProtectedRoute>
      <SettingLayout />
    </SettingProtectedRoute>
  );
}
