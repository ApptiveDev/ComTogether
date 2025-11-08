import style from './sidebar.module.css'
import { useGuidePart } from '../../../../stores/useGuidePart'
import SidebarItem from './sidebarItem';
import data from "../../../../dummy/dummy_guide.json";
import category from '@/assets/image/guideNav/category.svg';
import mainboard from '@/assets/image/guideNav/mainboard.svg';

const iconMap: Record<string, string> = {
  CPU: category,
  메인보드: mainboard,
  RAM: category,
  "그래픽 카드": category,
  "저장 장치": category,
  "파워 서플라이": category,
  "케이스": category,
  "쿨러/팬": category,
  "기타 입출력 장치": category,
};

export default function Sidebar(){
    const { selectCategory, setCurrentStep, setSelectCategory, setContentPart, setShowMore } = useGuidePart();

    return(
        <div className={style.container}>
            {data.map((item)=>(
                <SidebarItem
                    key={item.id}
                    category={item.category}
                    img={iconMap[item.category]}
                    onClick={()=>{
                        setSelectCategory(item.category);
                        setCurrentStep(item.id);
                        setContentPart("개요");
                        setShowMore(false);
                    }}
                    isSelected={selectCategory === item.category}
                />
            ))}
        </div>
    )
}