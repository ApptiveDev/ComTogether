import SettingLayout from "../components/layout/SettingLayout";
import SettingProtectedRoute from "../routes/SettingProtectedRoute";

export default function Setting() {
  return (
    <SettingProtectedRoute>
      <SettingLayout />
    </SettingProtectedRoute>
  );
}
