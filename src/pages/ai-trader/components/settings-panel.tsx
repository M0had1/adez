import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Input, Text } from '@deriv-com/ui';
import { useTranslations } from '@deriv-com/translations';
import AITraderStore from '@/stores/ai-trader-store';
import { VolatilitySelector } from './volatility-selector';
import { TradeTypeSelector } from './trade-type-selector';
import { AlternationSettings } from './alternation-settings';
import { IComponentProps } from '../types/ai-trader.types';
import './settings-panel.scss';

interface ISettingsPanelProps extends IComponentProps {
    store: AITraderStore;
    onStartTrade: () => void;
    onStopTrade: () => void;
    isLoadingTrade?: boolean;
}

export const SettingsPanel = observer(
    ({ store, onStartTrade, onStopTrade, isLoadingTrade = false, className }: ISettingsPanelProps) => {
        const { localize } = useTranslations();
        const [showConfirmation, setShowConfirmation] = useState(false);

        const handleStartClick = () => {
            if (!store.is_trading) {
                setShowConfirmation(true);
            }
        };

        const confirmStart = () => {
            setShowConfirmation(false);
            onStartTrade();
        };

        const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseFloat(e.target.value) || 0;
            store.updateSettings('stake_amount', value);
        };

        const handleTicksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(e.target.value) || 1;
            store.updateSettings('number_of_ticks', Math.min(10, Math.max(1, value)));
        };

        const handleTimeoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(e.target.value) || 1000;
            store.updateSettings('timeout_between_trades', value);
        };

        return (
            <div className={`settings-panel ${className || ''}`}>
                <div className='settings-panel__header'>
                    <Text as='h2' weight='bold' size='sm'>
                        {localize('AI Trading Settings')}
                    </Text>
                </div>

                <div className='settings-panel__content'>
                    {/* Volatility & Trade Type Selection */}
                    <div className='settings-panel__section'>
                        <Text weight='bold' size='xs'>
                            {localize('Market Settings')}
                        </Text>
                        <div className='settings-panel__form-group'>
                            <VolatilitySelector store={store} />
                        </div>
                        <div className='settings-panel__form-group'>
                            <TradeTypeSelector store={store} />
                        </div>
                    </div>

                    {/* Trade Configuration */}
                    <div className='settings-panel__section'>
                        <Text weight='bold' size='xs'>
                            {localize('Trade Configuration')}
                        </Text>

                        <div className='settings-panel__form-group'>
                            <label className='settings-panel__label'>{localize('Stake Amount')}</label>
                            <Input
                                type='number'
                                value={store.settings.stake_amount.toString()}
                                onChange={handleStakeChange}
                                disabled={store.is_trading}
                                min='0.01'
                                step='0.01'
                                className='settings-panel__input'
                                aria-label='stake-amount'
                            />
                        </div>

                        <div className='settings-panel__form-group'>
                            <label className='settings-panel__label'>{localize('Number of Ticks')}</label>
                            <Input
                                type='number'
                                value={store.settings.number_of_ticks.toString()}
                                onChange={handleTicksChange}
                                disabled={store.is_trading}
                                min='1'
                                max='10'
                                className='settings-panel__input'
                                aria-label='number-of-ticks'
                            />
                        </div>

                        <div className='settings-panel__form-group'>
                            <label className='settings-panel__label'>{localize('Timeout Between Trades (ms)')}</label>
                            <Input
                                type='number'
                                value={store.settings.timeout_between_trades.toString()}
                                onChange={handleTimeoutChange}
                                disabled={store.is_trading}
                                min='100'
                                step='100'
                                className='settings-panel__input'
                                aria-label='timeout-between-trades'
                            />
                        </div>
                    </div>

                    {/* Alternation Settings */}
                    <div className='settings-panel__section'>
                        <AlternationSettings store={store} />
                    </div>

                    {/* Action Buttons */}
                    <div className='settings-panel__actions'>
                        {!store.is_trading ? (
                            <Button
                                onClick={handleStartClick}
                                primary
                                is_loading={isLoadingTrade}
                                disabled={isLoadingTrade}
                                className='settings-panel__button'
                            >
                                {localize('Start Trading')}
                            </Button>
                        ) : (
                            <Button
                                onClick={onStopTrade}
                                secondary
                                className='settings-panel__button settings-panel__button--danger'
                            >
                                {localize('Stop Trading')}
                            </Button>
                        )}
                    </div>

                    {/* Error Message */}
                    {store.has_error && (
                        <div className='settings-panel__error'>
                            <Text size='xs' color='loss'>{store.error_message}</Text>
                        </div>
                    )}
                </div>

                {/* Confirmation Dialog */}
                {showConfirmation && (
                    <div className='settings-panel__confirmation-overlay'>
                        <div className='settings-panel__confirmation'>
                            <Text weight='bold' size='sm'>
                                {localize('Start Automated Trading')}
                            </Text>
                            <Text size='xs' className='settings-panel__confirmation-text'>
                                {localize(
                                    'Are you sure you want to start automated trading? This will execute real trades based on your settings.'
                                )}
                            </Text>
                            <div className='settings-panel__confirmation-actions'>
                                <Button
                                    secondary
                                    onClick={() => setShowConfirmation(false)}
                                >
                                    {localize('Cancel')}
                                </Button>
                                <Button
                                    primary
                                    onClick={confirmStart}
                                >
                                    {localize('Confirm')}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

SettingsPanel.displayName = 'SettingsPanel';
