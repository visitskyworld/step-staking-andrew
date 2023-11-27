import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { Layout, Typography } from 'antd';
import { Space } from 'antd';
import Image from 'next/image';
import { useBalance } from '../hooks/useBalance';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToken } from '../hooks/useToken';
import Staking from '../components/Staking';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const AntDesignWalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-ant-design')).WalletMultiButton,
    { ssr: false }
);

const Index: NextPage = () => {
    const { balance } = useBalance();
    const { stepTokenBalance, xStepTokenBalance } = useToken();
    const { connected } = useWallet();

    /**
     * TODO: Calculate staking APY
     */
    const stakingAPY = 14.18;

    return (
        <Layout style={{ height: '100vh' }}>
            <Header className="flex justify-between items-center bg-[#000]">
                <Title level={2}>Step</Title>
                <div className="flex justify-center items-center gap-2">
                    {connected && (
                        <Text>
                            {balance.toFixed(6)} SOL | {stepTokenBalance.toFixed(2)} STEP |{' '}
                            {xStepTokenBalance.toFixed(2)} xSTEP
                        </Text>
                    )}

                    <AntDesignWalletMultiButtonDynamic className="flex" />
                </div>
            </Header>
            <Layout>
                <Content className="mx-auto">
                    <Space direction="vertical" size={16}>
                        <Space direction="vertical" size={16} className="p-8 rounded-lg max-w-[450px] bg-[#141414]">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Image
                                        alt="Token icon"
                                        width={28}
                                        height={28}
                                        src="/xstep.svg"
                                        className="rounded-full mr-2"
                                    />
                                    <Text className="font-bold text-white ml-2">xSTEP staking APY</Text>
                                </div>
                                <Text className="font-bold text-white font-spacemono">{stakingAPY}%</Text>
                            </div>
                            <div className="mt-[25px] flex flex-col">
                                <Text className="font-bold text-white mb-[15px]">“Where is my staking reward?”</Text>
                                <Text className="text-[#bbb] leading-6">
                                    {`xSTEP is a yield bearing asset. This means it is automatically worth more STEP over
                                time. You don't need to claim any rewards, or do anything other than hold your xSTEP to
                                benefit from this. Later, when you unstake your xSTEP you will receive more STEP than
                                you initially deposited.`}
                                </Text>
                            </div>
                        </Space>
                        <Staking />
                    </Space>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Index;
