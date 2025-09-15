import style from "./footer.module.css";
import MenuList from "./menuList";
import youtubeAndInstagram from "@/assets/image/youtubeAndInstagram.svg";

export default function Footer() {
  return (
    <div className={style.container}>
      <div className={style.footer}>
        <div className={style.footerTop}>
          <div className={style.logo}>
            COM
            <br />
            TOGETHER
          </div>
          <div className={style.footerMenu}>
            <MenuList title="소개" items={["서비스 소개"]} />
            <MenuList
              title="기능"
              items={["가이드", "전문가 상담", "커뮤니티"]}
            />
            <MenuList title="이용약관" items={["이용약관"]} />
          </div>
        </div>

        <div className={style.footerBottom}>
          <div className={style.info}>
            <div className={style.company}>
              <div>(주)컴투게더</div>
              <div>주소 : 부산광역시 금정구 부산대학로63번길 2</div>
              <div className={style.companyInfo}>
                <div>전자우편주소 : comtogether@cmg.com</div>
                <div>사업자번호등록 : 000-00-0000</div>
                <div>전화번호 : 051-000-0000</div>
              </div>
            </div>
            <div className={style.policy}>
              <div>이용약관</div>
              <div>개인정보처리방침</div>
            </div>
            <div className={style.copyright}>
              Copyright COMTOGETHER All rights reserved.
            </div>
          </div>

          <div className={style.socialLink}>
            <img src={youtubeAndInstagram} alt="socialLink" />
          </div>
        </div>
      </div>
    </div>
  );
}
