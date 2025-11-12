import style from "./signInButton.module.css";
import kakao from "../../../../assets/image/kakao.svg";
import { useKakaoLogin } from "../../../../api/services/useKakaoLogin";

export default function SignInButton() {
  const { initiateKakaoLogin } = useKakaoLogin();

  return (
    <button className={style.signInBtn} onClick={initiateKakaoLogin}>
      <img src={kakao} alt="kakao" />
      <span>카카오로 시작하기</span>
    </button>
  );
}
