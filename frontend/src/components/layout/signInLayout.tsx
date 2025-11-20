import style from "./signInLayout.module.css";
import BrandSection from "../common/signIn/brandSection/BrandSection";
import AuthSection from "../common/signIn/authSection/AuthSection";

export default function SignInLayout() {
  return (
    <div className={style.container}>
      <BrandSection />
      <AuthSection />
    </div>
  );
}
