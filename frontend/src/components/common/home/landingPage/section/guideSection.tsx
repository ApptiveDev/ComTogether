import image from '@/assets/image/image_temp.png'
import Section from './section'

export default function GuideSection(){

    return(
        <Section 
        title="가이드"
        description={`막막했던 컴퓨터 지식,\n차근차근 단계별로\n알려드려요`}
        subtext={`친절한 가이드와 함께 조립형 PC를 시작해 보세요.\n부품 알아보는 순서, 각 부품의 기능 설명,\n알아두면 좋은 유의사항까지 한눈에 확인할 수 있어요.`}
        imageSrc={image}
        color="#fcfcfc"
        />
    )
}