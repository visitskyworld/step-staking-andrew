import React, { useState } from 'react';
import { Tabs } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import Stake from './Stake';
import UnStake from './UnStake';
import { useStepPrice } from '../hooks/useStepPrice';
import { useToken } from '../hooks/useToken';

const Staking: React.FC = () => {
    const [stakeAmount, setStakeAmount] = useState('');
    const [unStakeAmount, setUnStakeAmount] = useState('');

    /**
     * TODO: Calculate rate
     */
    const rate = 0.8031400452;

    const { price } = useStepPrice();
    const { stepTokenBalance, xStepTokenBalance, getTokenBalance } = useToken();

    return (
        <div>
            <Tabs
                defaultActiveKey="1"
                type="card"
                size={'large'}
                items={[
                    {
                        key: 'stake',

                        label: (
                            <div>
                                <DownloadOutlined />
                                <span className="font-bold">Stake</span>
                            </div>
                        ),
                        children: (
                            <Stake
                                price={price}
                                stepTokenBalance={stepTokenBalance}
                                xStepTokenBalance={xStepTokenBalance}
                                stakeAmount={stakeAmount}
                                setStakeAmount={setStakeAmount}
                                unStakeAmount={unStakeAmount}
                                setUnStakeAmount={setUnStakeAmount}
                                rate={rate}
                                getTokenBalance={getTokenBalance}
                            />
                        ),
                    },
                    {
                        key: 'unstake',
                        label: (
                            <div>
                                <UploadOutlined />
                                <span className="font-bold">Unstake</span>
                            </div>
                        ),
                        children: (
                            <UnStake
                                price={price}
                                stepTokenBalance={stepTokenBalance}
                                xStepTokenBalance={xStepTokenBalance}
                                stakeAmount={stakeAmount}
                                setStakeAmount={setStakeAmount}
                                unStakeAmount={unStakeAmount}
                                setUnStakeAmount={setUnStakeAmount}
                                rate={rate}
                                getTokenBalance={getTokenBalance}
                            />
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default Staking;
