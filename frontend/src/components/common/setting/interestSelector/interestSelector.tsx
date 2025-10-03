import style from './interestSelector.module.css';
import InterestButton from '../interestButton/interestButton';
import CustomInterest from '../customInterest/customInterest';
import AddInterestButton from '../addInterestButton/addInterestButton';
import data from '@/dummy/dummy_interest.json';
import { useState } from 'react';

type InterestItem = {
  id: number;
  interest: string;
};

interface InterestSelectorProps {
    count: number;
    setCount: (count: number) => void;
}

export default function InterestSelector({ count, setCount }: InterestSelectorProps){
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [isAdded, setIsAdded] = useState(false);
    const [newInterest, setNewInterest] = useState('');
    const [customInterests, setCustomInterests] = useState<string[]>([]);

    const handleClick = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(item => item !== interest));
            setCount(count - 1);
        } else {
            setSelectedInterests([...selectedInterests, interest]);
            setCount(count + 1);
        }
    };

    const handleConfirm = () => {
        if(newInterest.trim() !== ''){
            setCustomInterests([...customInterests, newInterest.trim()]);
            setSelectedInterests([...selectedInterests, newInterest.trim()]);
            setNewInterest('');
            setIsAdded(false);
            setCount(count + 1);
        }
    }

    const handleCancel = () => {
        setNewInterest('');
        setIsAdded(false);
    }

    return(
        <div className={style.container}>
            {data.map((interestItem: InterestItem) => (
                <InterestButton
                    key={interestItem.interest}
                    onClick={() => handleClick(interestItem.interest)}
                    selected={selectedInterests.includes(interestItem.interest)}
                >
                    <div className={style.inputContainer}>{interestItem.interest}</div>
                </InterestButton>
            ))}
            {customInterests.map((interest: string) => (
                <InterestButton
                    key={interest}
                    onClick={() => handleClick(interest)}
                    selected={selectedInterests.includes(interest)}
                >
                    <div className={style.inputContainer}>{interest}</div>
                </InterestButton>
            ))}

            {isAdded ? (
                <InterestButton onClick={() => {}} selected={true}>
                    <CustomInterest
                        value={newInterest}
                        onChange={setNewInterest}
                        handleConfirm={handleConfirm}
                        handleCancel={handleCancel}
                    />
                </InterestButton>
            ) : (
                <AddInterestButton
                    onClick={() => setIsAdded(true)}
                />
            )}
        </div>
    )
}