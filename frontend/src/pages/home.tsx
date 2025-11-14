import GlossaryLayout from "../components/layout/glossaryLayout";
import HomeLayout from "../components/layout/homeLayout";
import HomeProtectedRoute from "../routes/HomeProtectedRoute";

export default function Home() {
  return (
    <HomeProtectedRoute>
      <HomeLayout />
      <GlossaryLayout />
    </HomeProtectedRoute>
  );
}
