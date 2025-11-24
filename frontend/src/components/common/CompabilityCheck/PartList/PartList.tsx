import styles from './partList.module.css'
import PartPage from './PartPage/PartPage'
import SearchBar from './SearchBar/SearchBar'
import Pagination from './Pagination/Pagination'
import { usePartListStore } from '@/stores/usePartListStore'
import productData from '@/dummy/dummy_compabilityCheck.json'
import type { item } from '@/types/compability'

function getSearchPageItems(
  searchItem: item[],
  currentPage: number,
  itemsPerPage: number = 5
){
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return searchItem.slice(startIndex, endIndex);
}

export default function PartList(){
    const {currentCategory, currentPage, searchResult, setSearchResult} = usePartListStore();
    
    const categoryItem = productData.find((c) => c.name === currentCategory);
    if (!categoryItem) return

    const searchItem = searchResult.length > 0 ? searchResult : categoryItem.products;
    const totalSearchItems = searchItem.length;
    const totalSearchPages = Math.ceil(totalSearchItems / 5); //itemsPerPage = 5

    const pageItems = getSearchPageItems(searchItem, currentPage);

    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.category}>{currentCategory}</div>
                <div className={styles.metabox}>
                    <div className={styles.totalItem}>총 {totalSearchItems}건</div>
                    <SearchBar
                    setSearchResult={setSearchResult}
                    categoryItem={categoryItem.products}
                    />
                </div>
            </div>
            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    <div className={styles.colImage}></div>       
                    <div className={styles.colName}>제품명</div>  
                    <div className={styles.colPrice}>판매가격</div>
                </div>
                <PartPage
                pageItems={pageItems}
                />
            </div>
            <Pagination
            totalPages={totalSearchPages}
            />
        </div>
    )
}