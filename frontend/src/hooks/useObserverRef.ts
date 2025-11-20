import {useRef,useEffect} from "react";

interface useObserverProp{
    handleObserver: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useObserverRef({handleObserver}:useObserverProp){
    const ref = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        const observer = new IntersectionObserver(([entry])=>{
            if (entry.isIntersecting){
                handleObserver?.(true);
                if (ref.current){
                    observer.unobserve(ref.current);
                }
            }
        },{threshold:0.2});

        if(ref.current){
            observer.observe(ref.current);
        }

        return ()=> observer.disconnect();
    }, [handleObserver]);

    return ref;
}
