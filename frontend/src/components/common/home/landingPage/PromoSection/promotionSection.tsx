import ContentBlock from "./contentBlock";
import style from './promotionSection.module.css'
import firstPromo from '@/assets/image/promo_1.png'
import secondPromo from '@/assets/image/promo_2.png'
import thirdPromo from '@/assets/image/promo_3.png'
import useObserverRef from "../../../../../hooks/useObserverRef";
import { useState } from "react";

export default function PromoSection(){
    const [showHeadline, setShowHeadline] = useState(false);
    const ref = useObserverRef({handleObserver:setShowHeadline});

    return(
        <div className={style.container}>
            <div ref={ref} className={`${style.mainHeadline} ${showHeadline? style.show:''}`}>
                어떤 PC를<br/>
                어떻게 구매해야 할지<br/>
                항상 망설이셨나요?
            </div>
            <ContentBlock
            imageSrc={firstPromo}
            headline={`가이드부터 전문가 매칭까지\n컴투게더로 한 번에`}
            subline={`컴투게더 커뮤니티에서는 초보자도 활동을 통해\n레벨업하며 숙련자로 성장할 수 있고,\n함께 경험을 나누며 재미있게 소통할 수 있어요.`}
            />
            <ContentBlock
            imageSrc={secondPromo}
            headline={`어떤 PC를\n어떻게 구매해야 할지\n항상 망설이셨나요?`}
            subline={`컴투게더 커뮤니티에서는 초보자도 활동을 통해\n레벨업하며 숙련자로 성장할 수 있고,\n함께 경험을 나누며 재미있게 소통할 수 있어요.`}
            />
            <ContentBlock
            imageSrc={thirdPromo}
            headline={`어떤 PC를\n어떻게 구매해야 할지\n항상 망설이셨나요?`}
            subline={`컴투게더 커뮤니티에서는 초보자도 활동을 통해\n레벨업하며 숙련자로 성장할 수 있고,\n함께 경험을 나누며 재미있게 소통할 수 있어요.`}
            />
        </div>
    )
}