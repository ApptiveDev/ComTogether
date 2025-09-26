import { logout } from "../services/authService";

export default function MyPage() {
  return (
    <div>
      마이페이지
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}
