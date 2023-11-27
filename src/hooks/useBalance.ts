import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

// Establish connection to the Solana network
export const useBalance = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState(0);

    const getSolBalance = async () => {
        if (!publicKey) {
            return;
        }

        try {
            const data = await connection.getBalance(publicKey);
            setBalance(data / LAMPORTS_PER_SOL);
        } catch (error) {
            console.error('Error fetching SOL balance:', error);
        }
    };

    useEffect(() => {
        getSolBalance();
    }, [publicKey]);

    return {
        balance,
    };
};
