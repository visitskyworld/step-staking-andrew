import { useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { STEP_TOKEN_ADDRESS, XSTEP_TOKEN_ADDRESS } from '../constants';

export const useToken = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const [stepTokenBalance, setStepTokenBalance] = useState(0);
    const [xStepTokenBalance, setXStepTokenBalance] = useState(0);

    async function getTokenBalance() {
        try {
            if (!publicKey) {
                return;
            }
            const response = await connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: TOKEN_PROGRAM_ID,
            });
            response.value.forEach((accountInfo) => {
                const tokenInfo = accountInfo.account.data.parsed?.info;
                const tokenMintAddress = tokenInfo?.mint;
                if (tokenMintAddress === STEP_TOKEN_ADDRESS) {
                    setStepTokenBalance(tokenInfo['tokenAmount']['uiAmount']);
                }
                if (tokenMintAddress === XSTEP_TOKEN_ADDRESS) {
                    setXStepTokenBalance(tokenInfo['tokenAmount']['uiAmount']);
                }
            });
        } catch (error) {
            console.error('Error fetching token balance:', error);
        }
    }

    useEffect(() => {
        getTokenBalance();
    }, [publicKey]);

    return {
        stepTokenBalance,
        xStepTokenBalance,
        getTokenBalance,
    };
};
