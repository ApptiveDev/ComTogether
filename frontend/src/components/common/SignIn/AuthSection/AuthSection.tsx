import style from "./authSection.module.css";
import SignInButton from "../SignInButton/SignInButton";
import AdminLoginModal from "../AdminLoginModal/AdminLoginModal";
import { useState } from "react";

export default function AuthSection() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  return (
    <div className={style.container}>
      <div className={style.content}>
        <button
          className={style.adminButton}
          onClick={() => setIsAdminModalOpen(true)}
        >
          🔐 관리자 로그인
        </button>
        <div className={style.logo}>
          COM
          <br />
          TOGETHER
        </div>
        <SignInButton />
      </div>
      <div className={style.copyright}>
        &copy; 2025 COMTOGETHER. All Rights Reserved.
      </div>

      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
