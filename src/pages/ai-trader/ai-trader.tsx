import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslations } from '@deriv-com/translations';
import AITraderStore from '@/stores/ai-trader-store';
import { useStore } from '@/hooks/useStore';
import { SettingsPanel } from './components/settings-panel';
import { RiskManagementPanel } from './components/risk-management-panel';
import { MartingaleSettings } from './components/martingale-settings';
import { LiveTradingMonitor } from './components/live-trading-monitor';
import './ai-trader.scss';

interface IAITraderPageProps {
    aiStore?: AITraderStore;
}

export const AITraderPage = observer(({ aiStore }: IAITraderPageProps) => {
    const { localize } = useTranslations();
    const store = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [localStore] = useState(() => aiStore || new AITraderStore());

    // Simulate getting user's account balance
    const accountBalance = store?.client?.balance ?? 1000;

    const handleStartTrading = async () => {
        setIsLoading(true);
        try {
            // Initialize trading with current account balance
            localStore.startTrading(accountBalance);

            // TODO: Initialize Deriv API connection for ticks
            // This would connect to Deriv's ticks stream for the selected volatility index
            
            console.log('[v0] AI Trading started with settings:', localStore.settings);
        } catch (error) {
            localStore.setError(localize('Failed to start trading. Please try again.'));
            console.error('[v0] Error starting trading:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStopTrading = () => {
        localStore.stopTrading();
        console.log('[v0] AI Trading stopped');
    };

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (localStore.is_trading) {
                localStore.stopTrading();
            }
        };
    }, [localStore]);

    return (
        <div className='ai-trader-page'>
            <div className='ai-trader-page__container'>
                {/* Left Sidebar - Settings */}
                <div className='ai-trader-page__sidebar'>
                    <div className='ai-trader-page__panels'>
                        <SettingsPanel
                            store={localStore}
                            onStartTrade={handleStartTrading}
                            onStopTrade={handleStopTrading}
                            isLoadingTrade={isLoading}
                        />
                        <RiskManagementPanel store={localStore} />
                        <MartingaleSettings store={localStore} />
                    </div>
                </div>

                {/* Main Content - Monitor & Stats */}
                <div className='ai-trader-page__main'>
                    <LiveTradingMonitor store={localStore} />
                </div>
            </div>
        </div>
    );
});

AITraderPage.displayName = 'AITraderPage';

export default AITraderPage;
