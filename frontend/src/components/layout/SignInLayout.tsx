import style from "./signInLayout.module.css";
import BrandSection from "../common/SignIn/BrandSection/BrandSection";
import AuthSection from "../common/SignIn/AuthSection/AuthSection";

export default function SignInLayout() {
  return (
    <div className={style.container}>
      <BrandSection />
      <AuthSection />
    </div>
  );
}
