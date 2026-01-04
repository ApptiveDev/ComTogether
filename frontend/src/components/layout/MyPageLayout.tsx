import style from "./MyPageLayout.module.css";
import Header from "../common/Header/Header";
import ProfileHeader from "../common/MyPage/ProfileHeader/ProfileHeader";
import SideMenu from "../common/MyPage/SideMenu/SideMenu";
import InterestSection from "../common/MyPage/InterestSection/InterestSection";
import QuoteSection from "../common/MyPage/QuoteSection/QuoteSection";
import ConsultationSection from "../common/MyPage/ConsultationSection/ConsultationSection";
import type { UserData } from "@/types/user";
import type { QuoteListResponse } from "@/types/quote";

type MyPageLayoutProps = {
  user: UserData | null;
  isUserLoading?: boolean;
  hasUserError?: boolean;
  quotes: QuoteListResponse[];
  isQuotesLoading?: boolean;
  hasQuoteError?: boolean;
};

const ROLE_LABEL: Record<UserData["role"], string> = {
  BEGINNER: "초보자",
  EXPERT: "전문가",
  ADMIN: "관리자",
};

const formatJoinDate = (isoDate?: string) => {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export default function MyPageLayout({
  user,
  isUserLoading,
  hasUserError,
  quotes,
  isQuotesLoading,
  hasQuoteError,
}: MyPageLayoutProps) {
  const levelLabel = user?.role ? ROLE_LABEL[user.role] : "회원";
  const joinDate = formatJoinDate(user?.created_at);

  return (
    <div className={style.container}>
      <Header />

      <ProfileHeader
        name={user?.name}
        levelLabel={levelLabel}
        joinDate={joinDate}
        profileImageUrl={user?.profile_image_url}
        isLoading={!user && isUserLoading}
      />

      <div className={style.content}>
        <SideMenu />
        <div className={style.divider} />

        <main className={style.main}>
          <InterestSection
            interests={user?.interests ?? []}
            isLoading={isUserLoading}
            hasError={hasUserError}
          />
          <QuoteSection
            quotes={quotes}
            isLoading={isQuotesLoading}
            hasError={hasQuoteError}
          />
          <ConsultationSection />
        </main>
      </div>
    </div>
  );
}
