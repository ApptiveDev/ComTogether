import styles from './partPage.module.css'
import PartItem from './PartItem'
import type { item } from '@/types/compability';

interface partPageProps {
  pageItems: item[];
}

export default function PartPage({ pageItems }: partPageProps){

    return(
        <div className={styles.container}>
            {pageItems?.map((item) => (
                <PartItem
                key={item.id}
                name={item.name}
                price={item.price}
                />
            ))}
        </div>
    )
}