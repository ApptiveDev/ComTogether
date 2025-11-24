import type { item } from "@/types/compability";
import { useRef} from 'react'
import styles from './searchBar.module.css'
import { usePartListStore } from "@/stores/usePartListStore";
import SearchIcon from '@/assets/image/searchIcon.svg'

interface SearchBarProps {
  setSearchResult: (result: item[]) => void;
  categoryItem: item[]
}

export default function SearchBar({setSearchResult, categoryItem}:SearchBarProps){
    const {inputValue, setInputValue, setCurrentPage} = usePartListStore();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = () => {
        const trimInput = inputValue.trim();
        if (!trimInput) return;
        const lowerInput = trimInput.toLowerCase();

        const result = categoryItem.filter((item) => item.name.toLowerCase().includes(lowerInput));

        setSearchResult(result);
        inputRef.current?.blur(); // 입력창 포커스 해제
    }
    return(
        <div className={styles.container}>
            <form
            className={styles.form}
            onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
                setCurrentPage(1);
            }}
            >
                <input
                className={styles.input}
                ref={inputRef}
                type="text"
                placeholder="검색어를 입력해주세요"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                />

                <button className={styles.submit} type="submit"><img src={SearchIcon} alt="search"/></button>
            </form>
        </div>
    )
}