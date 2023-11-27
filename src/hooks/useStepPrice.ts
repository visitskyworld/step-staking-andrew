import { useEffect, useState } from 'react';
import { getPrice } from '../utils';

export const useStepPrice = () => {
    const [price, setPrice] = useState(0);

    const getStepPrice = async () => {
        const amount = await getPrice('step-finance');
        setPrice(amount);
    };

    useEffect(() => {
        getStepPrice();
    }, []);

    return {
        price,
    };
};
