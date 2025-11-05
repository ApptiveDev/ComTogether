import ChatBotLayout from "../components/layout/chatBotLayout";
import HomeLayout from "../components/layout/homeLayout";
import HomeProtectedRoute from "../routes/HomeProtectedRoute";

export default function Home() {
  return (
    <HomeProtectedRoute>
      <HomeLayout />
      <ChatBotLayout />
    </HomeProtectedRoute>
  );
}
