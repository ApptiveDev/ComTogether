import GlossaryLayout from "../components/layout/GlossaryLayout";
import HomeLayout from "../components/layout/HomeLayout";
import HomeProtectedRoute from "../routes/HomeProtectedRoute";

export default function Home() {
  return (
    <HomeProtectedRoute>
      <HomeLayout />
      <GlossaryLayout />
    </HomeProtectedRoute>
  );
}
