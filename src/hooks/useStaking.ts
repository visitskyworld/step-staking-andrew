import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { STAKE_PROGRAM_ID, STAKING_IDL, STEP_TOKEN_ADDRESS, XSTEP_TOKEN_ADDRESS } from '../constants';
import { useNotify } from '../components/notify';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { Program, AnchorProvider, BN, Idl } from '@project-serum/anchor';
import { useToken } from './useToken';

export const useStaking = () => {
    const wallet = useWallet();

    const { publicKey } = useWallet();
    const programId = new PublicKey(STAKE_PROGRAM_ID);
    const tokenMintPublicKey = new PublicKey(STEP_TOKEN_ADDRESS);
    const xTokenMintPublicKey = new PublicKey(XSTEP_TOKEN_ADDRESS);

    const notify = useNotify();

    const getProvider = async () => {
        const network = 'https://api.metaplex.solana.com/';
        const connection = new Connection(network, 'processed');
        // @ts-ignore
        const provider = new AnchorProvider(connection, wallet, 'processed');
        return provider;
    };

    const stake = async (amount = 0.01) => {
        try {
            if (!publicKey) {
                return;
            }
            const provider = await getProvider();
            const program = new Program(STAKING_IDL as Idl, programId, provider);

            const [vaultPubkey, vaultBump] = PublicKey.findProgramAddressSync(
                [tokenMintPublicKey.toBuffer()],
                programId
            );
            const tokenAddress = await getAssociatedTokenAddress(tokenMintPublicKey, publicKey);
            const xTokenAddress = await getAssociatedTokenAddress(xTokenMintPublicKey, publicKey);

            const signature = await program.methods
                .stake(vaultBump, new BN(amount * 10 ** 9))
                .accounts({
                    tokenMint: tokenMintPublicKey,
                    xTokenMint: xTokenMintPublicKey,
                    tokenFrom: tokenAddress,
                    tokenFromAuthority: publicKey,
                    tokenVault: vaultPubkey,
                    xTokenTo: xTokenAddress,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .rpc();
            notify('success', 'Transaction successful!', signature);
        } catch (err: any) {
            console.log('Transaction error: ', err);
            notify('error', `Transaction failed! ${err?.message}`);
        }
    };

    const unStake = async (amount: number = 0) => {
        try {
            if (!publicKey) {
                return;
            }
            const provider = await getProvider();
            const program = new Program(STAKING_IDL as Idl, programId, provider);

            const [vaultPubkey, vaultBump] = PublicKey.findProgramAddressSync(
                [tokenMintPublicKey.toBuffer()],
                programId
            );
            const tokenAddress = await getAssociatedTokenAddress(tokenMintPublicKey, publicKey);
            const xTokenAddress = await getAssociatedTokenAddress(xTokenMintPublicKey, publicKey);

            const signature = await program.methods
                .unstake(vaultBump, new BN(amount * 10 ** 9))
                .accounts({
                    tokenMint: tokenMintPublicKey,
                    xTokenMint: xTokenMintPublicKey,
                    xTokenFrom: xTokenAddress,
                    xTokenFromAuthority: publicKey,
                    tokenVault: vaultPubkey,
                    tokenTo: tokenAddress,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .rpc();
            notify('success', 'Transaction successful!', signature);
        } catch (err: any) {
            console.log('Transaction error: ', err);
            notify('error', `Transaction failed! ${err?.message}`);
        }
    };

    return { unStake, stake };
};
