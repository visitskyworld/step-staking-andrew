import React, { useMemo } from 'react';
import { Button, Space, Typography } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { toOptionalFixed } from '../utils';
import { useWallet } from '@solana/wallet-adapter-react';
import { useStaking } from '../hooks/useStaking';

const { Text } = Typography;

interface StakeProps {
    stakeAmount: string;
    setStakeAmount: (value: string) => void;
    unStakeAmount: string;
    setUnStakeAmount: (value: string) => void;
    rate: number;
    price: number;
    stepTokenBalance: number;
    xStepTokenBalance: number;
    getTokenBalance: () => void;
}

const Stake: React.FC<StakeProps> = ({
    stakeAmount,
    setStakeAmount,
    unStakeAmount,
    setUnStakeAmount,
    rate,
    price,
    stepTokenBalance,
    xStepTokenBalance,
    getTokenBalance,
}) => {
    const { connected } = useWallet();
    const { stake } = useStaking();

    const onChangeStakeAmount = (value: string) => {
        if (isNaN(Number(value))) {
            return;
        }
        setStakeAmount(value);
        setUnStakeAmount(toOptionalFixed(Number(value) * rate));
    };

    const onChangeUnStakeAmount = (value: string) => {
        if (isNaN(Number(value))) {
            return;
        }
        setUnStakeAmount(value);
        setStakeAmount(toOptionalFixed(Number(value) / rate));
    };

    const onSelectPercent = (percent: number = 1) => {
        const amount = stepTokenBalance * percent;
        setStakeAmount(toOptionalFixed(amount));
        setUnStakeAmount(toOptionalFixed(Number(amount) * rate));
    };

    const displayPrice = useMemo(() => {
        return (price * Number(stakeAmount)).toFixed(2);
    }, [price, stakeAmount]);

    const onSubmit = async () => {
        await stake(Number(stakeAmount));
        getTokenBalance();
    };

    return (
        <Space direction="vertical" className="bg-[#141414] w-[450px] p-[20px] rounded-b-lg mt-[-16px]">
            <div className="flex justify-between items-center">
                <Text>You stake</Text>
                <div className="flex justify-center items-center gap-2">
                    <Text className="text-[#bbb]">Balance: {stepTokenBalance}</Text>
                    {!!stepTokenBalance && (
                        <>
                            <Button size="small" onClick={() => onSelectPercent(0.5)}>
                                HALF
                            </Button>
                            <Button size="small" onClick={() => onSelectPercent(1)}>
                                MAX
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center bg-black rounded-lg p-[12px]">
                <div className="flex justify-center items-center">
                    <Image alt="xstep" width={28} height={28} src="/step.png" className="rounded-full" />
                    <Text className="ml-2 font-bold">STEP</Text>
                </div>
                <div className="flex flex-col items-end">
                    <input
                        className="border-none bg-black outline-none text-right font-spacemono font-bold text-lg"
                        placeholder="0.00"
                        value={stakeAmount}
                        onChange={(e) => onChangeStakeAmount(e.target.value)}
                    />
                    <Text className="text-xs">${displayPrice}</Text>
                </div>
            </div>
            <div className="flex justify-center items-center my-2">
                <ArrowDownOutlined
                    style={{
                        fontSize: 35,
                        color: '#ffbb1d',
                    }}
                />
            </div>
            <div className="flex justify-between items-center">
                <Text>You receive</Text>
                <Text className="text-[#bbb]">Balance: {xStepTokenBalance}</Text>
            </div>
            <div className="flex justify-between items-center bg-black rounded-lg p-[12px]">
                <div className="flex justify-center items-center">
                    <Image alt="step" width={28} height={28} src="/xstep.svg" className="rounded-full" />

                    <Text className="ml-2 font-bold">xSTEP</Text>
                </div>
                <div className="flex flex-col items-end">
                    <input
                        className="border-none bg-black outline-none text-right font-spacemono font-bold text-lg"
                        placeholder="0.00"
                        value={unStakeAmount}
                        onChange={(e) => onChangeUnStakeAmount(e.target.value)}
                    />
                    <Text className="text-xs">${displayPrice}</Text>
                </div>
            </div>
            <Button
                size="large"
                className="w-full"
                type="primary"
                onClick={onSubmit}
                disabled={!connected || !stakeAmount || stepTokenBalance < Number(stakeAmount)}
            >
                {!connected
                    ? 'Connect Wallet'
                    : !stakeAmount
                    ? 'Enter an amount'
                    : stepTokenBalance < Number(stakeAmount)
                    ? 'Insufficient STEP balance'
                    : 'Stake'}
            </Button>
        </Space>
    );
};

export default Stake;
