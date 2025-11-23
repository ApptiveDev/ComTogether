import style from "./closingSection.module.css";
import logo from "@/assets/image/logo.svg";
import CtaButton from "../../CtaButton/CtaButton";
import { useState } from "react";
import useObserverRef from "../../../../../hooks/useObserverRef";
import { useNavigate } from "react-router-dom";

export default function ClosingSection() {
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  const textRef = useObserverRef({ handleObserver: setShowText });
  const buttonRef = useObserverRef({ handleObserver: setShowButton });

  return (
    <div className={style.container}>
      <div
        ref={textRef}
        className={`${style.textContent} ${showText ? style.show : ""}`}
      >
        세상에 컴알못이 사라질 때 까지
        <br />
        컴투게더가 함께 하겠습니다
      </div>
      <img className={style.logo} src={logo} alt="logo" />
      <div
        ref={buttonRef}
        className={`${style.buttons} ${showButton ? style.show : ""}`}
      >
        <CtaButton
          text="회원가입"
          color="#ff5525"
          backgroundColor="#161616"
          onClick={() => navigate("/sign-up")}
        />
        <CtaButton
          text="1:1 전문가 매칭"
          color="black"
          backgroundColor="white"
          onClick={() => navigate("/expert-consultation")}
        />
      </div>
    </div>
  );
}
