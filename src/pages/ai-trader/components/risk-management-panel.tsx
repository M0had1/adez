import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Input, Text } from '@deriv-com/ui';
import { useTranslations } from '@deriv-com/translations';
import AITraderStore from '@/stores/ai-trader-store';
import { IComponentProps } from '../types/ai-trader.types';
import './risk-management-panel.scss';

interface IRiskManagementPanelProps extends IComponentProps {
    store: AITraderStore;
}

export const RiskManagementPanel = observer(({ store, className }: IRiskManagementPanelProps) => {
    const { localize } = useTranslations();

    const handleMaxLossChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        store.updateRiskManagement('max_loss_limit', value);
    };

    const handleMaxWinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? null : parseFloat(e.target.value) || 0;
        store.updateRiskManagement('max_win_limit', value);
    };

    const handleMaxStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        store.updateRiskManagement('max_stake_limit', value);
    };

    const handleMinBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        store.updateRiskManagement('min_account_balance', value);
    };

    const handleMaxLossesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 5;
        store.updateRiskManagement('max_consecutive_losses', value);
    };

    const handleMaxTradesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 100;
        store.updateRiskManagement('max_daily_trades', value);
    };

    return (
        <div className={`risk-management-panel ${className || ''}`}>
            <div className='risk-management-panel__header'>
                <Text as='h2' weight='bold' size='sm'>
                    {localize('Risk Management')}
                </Text>
            </div>

            <div className='risk-management-panel__content'>
                {/* Loss & Win Limits */}
                <div className='risk-management-panel__section'>
                    <Text weight='bold' size='xs'>
                        {localize('Profit & Loss Limits')}
                    </Text>

                    <div className='risk-management-panel__form-group'>
                        <label className='risk-management-panel__label'>{localize('Max Daily Loss')}</label>
                        <Input
                            type='number'
                            value={store.risk_management.max_loss_limit.toString()}
                            onChange={handleMaxLossChange}
                            disabled={store.is_trading}
                            min='0'
                            step='1'
                            className='risk-management-panel__input'
                            aria-label='max-loss-limit'
                        />
                        <Text size='xs' className='risk-management-panel__help-text'>
                            {localize('Stop trading when daily loss reaches this amount')}
                        </Text>
                    </div>

                    <div className='risk-management-panel__form-group'>
                        <label className='risk-management-panel__label'>{localize('Max Daily Win (Optional)')}</label>
                        <Input
                            type='number'
                            value={store.risk_management.max_win_limit?.toString() || ''}
                            onChange={handleMaxWinChange}
                            disabled={store.is_trading}
                            min='0'
                            step='1'
                            placeholder='Leave empty for no limit'
                            className='risk-management-panel__input'
                            aria-label='max-win-limit'
                        />
                        <Text size='xs' className='risk-management-panel__help-text'>
                            {localize('Stop trading when daily profit reaches this amount')}
                        </Text>
                    </div>
                </div>

                {/* Account Protection */}
                <div className='risk-management-panel__section'>
                    <Text weight='bold' size='xs'>
                        {localize('Account Protection')}
                    </Text>

                    <div className='risk-management-panel__form-group'>
                        <label className='risk-management-panel__label'>{localize('Max Stake Limit')}</label>
                        <Input
                            type='number'
                            value={store.risk_management.max_stake_limit.toString()}
                            onChange={handleMaxStakeChange}
                            disabled={store.is_trading}
                            min='0.01'
                            step='0.01'
                            className='risk-management-panel__input'
                            aria-label='max-stake-limit'
                        />
                        <Text size='xs' className='risk-management-panel__help-text'>
                            {localize('Maximum allowed stake per trade')}
                        </Text>
                    </div>

                    <div className='risk-management-panel__form-group'>
                        <label className='risk-management-panel__label'>{localize('Minimum Account Balance')}</label>
                        <Input
                            type='number'
                            value={store.risk_management.min_account_balance.toString()}
                            onChange={handleMinBalanceChange}
                            disabled={store.is_trading}
                            min='0'
                            step='1'
                            className='risk-management-panel__input'
                            aria-label='min-account-balance'
                        />
                        <Text size='xs' className='risk-management-panel__help-text'>
                            {localize('Stop trading when balance falls below this amount')}
                        </Text>
                    </div>
                </div>

                {/* Trade Limits */}
                <div className='risk-management-panel__section'>
                    <Text weight='bold' size='xs'>
                        {localize('Trade Limits')}
                    </Text>

                    <div className='risk-management-panel__form-group'>
                        <label className='risk-management-panel__label'>{localize('Max Consecutive Losses')}</label>
                        <Input
                            type='number'
                            value={store.risk_management.max_consecutive_losses.toString()}
                            onChange={handleMaxLossesChange}
                            disabled={store.is_trading}
                            min='1'
                            step='1'
                            className='risk-management-panel__input'
                            aria-label='max-consecutive-losses'
                        />
                        <Text size='xs' className='risk-management-panel__help-text'>
                            {localize('Stop trading after this many consecutive losses')}
                        </Text>
                    </div>

                    <div className='risk-management-panel__form-group'>
                        <label className='risk-management-panel__label'>{localize('Max Daily Trades')}</label>
                        <Input
                            type='number'
                            value={store.risk_management.max_daily_trades.toString()}
                            onChange={handleMaxTradesChange}
                            disabled={store.is_trading}
                            min='1'
                            step='1'
                            className='risk-management-panel__input'
                            aria-label='max-daily-trades'
                        />
                        <Text size='xs' className='risk-management-panel__help-text'>
                            {localize('Maximum number of trades to execute per day')}
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
});

RiskManagementPanel.displayName = 'RiskManagementPanel';
