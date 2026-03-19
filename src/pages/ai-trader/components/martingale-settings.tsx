import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Input, Text, Checkbox } from '@deriv-com/ui';
import { useTranslations } from '@deriv-com/translations';
import AITraderStore from '@/stores/ai-trader-store';
import { IComponentProps } from '../types/ai-trader.types';
import './martingale-settings.scss';

interface IMartingaleSettingsProps extends IComponentProps {
    store: AITraderStore;
}

export const MartingaleSettings = observer(({ store, className }: IMartingaleSettingsProps) => {
    const { localize } = useTranslations();

    const handleEnableToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        store.updateMartingaleSettings('is_enabled', e.target.checked);
    };

    const handleMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 1.5;
        store.updateMartingaleSettings('multiplier', Math.max(1, value));
    };

    const handleMaxIncreaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 5;
        store.updateMartingaleSettings('max_increase', Math.max(1, value));
    };

    const handleResetToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        store.updateMartingaleSettings('reset_after_win', e.target.checked);
    };

    return (
        <div className={`martingale-settings ${className || ''}`}>
            <div className='martingale-settings__header'>
                <Text as='h2' weight='bold' size='sm'>
                    {localize('Martingale System')}
                </Text>
            </div>

            <div className='martingale-settings__content'>
                {/* Enable/Disable Toggle */}
                <div className='martingale-settings__toggle-section'>
                    <div className='martingale-settings__toggle-wrapper'>
                        <Checkbox
                            name='enable-martingale'
                            label={localize('Enable Martingale')}
                            value='martingale'
                            checked={store.martingale.is_enabled}
                            onChange={handleEnableToggle}
                            disabled={store.is_trading}
                            labelAlign='left'
                        />
                    </div>
                    <Text size='xs' className='martingale-settings__description'>
                        {localize(
                            'Martingale increases your stake after each loss to recover losses and make a profit.'
                        )}
                    </Text>
                </div>

                {/* Martingale Settings (Only visible when enabled) */}
                {store.martingale.is_enabled && (
                    <>
                        <div className='martingale-settings__section'>
                            <Text weight='bold' size='xs'>
                                {localize('Martingale Configuration')}
                            </Text>

                            <div className='martingale-settings__form-group'>
                                <label className='martingale-settings__label'>{localize('Stake Multiplier')}</label>
                                <Input
                                    type='number'
                                    value={store.martingale.multiplier.toString()}
                                    onChange={handleMultiplierChange}
                                    disabled={store.is_trading}
                                    min='1'
                                    step='0.1'
                                    className='martingale-settings__input'
                                    aria-label='martingale-multiplier'
                                />
                                <Text size='xs' className='martingale-settings__help-text'>
                                    {localize('Multiply stake by this amount after each loss')}
                                </Text>
                            </div>

                            <div className='martingale-settings__form-group'>
                                <label className='martingale-settings__label'>
                                    {localize('Max Consecutive Increases')}
                                </label>
                                <Input
                                    type='number'
                                    value={store.martingale.max_increase.toString()}
                                    onChange={handleMaxIncreaseChange}
                                    disabled={store.is_trading}
                                    min='1'
                                    step='1'
                                    className='martingale-settings__input'
                                    aria-label='martingale-max-increase'
                                />
                                <Text size='xs' className='martingale-settings__help-text'>
                                    {localize('Maximum number of consecutive stake increases')}
                                </Text>
                            </div>

                            <div className='martingale-settings__toggle-group'>
                                <Checkbox
                                    name='reset-after-win'
                                    label={localize('Reset After Win')}
                                    value='reset'
                                    checked={store.martingale.reset_after_win}
                                    onChange={handleResetToggle}
                                    disabled={store.is_trading}
                                    labelAlign='left'
                                />
                                <Text size='xs' className='martingale-settings__help-text'>
                                    {localize('Reset stake to initial amount after a winning trade')}
                                </Text>
                            </div>
                        </div>

                        {/* Current Status */}
                        <div className='martingale-settings__status'>
                            <Text size='xs' weight='bold'>
                                {localize('Current Status')}
                            </Text>
                            <div className='martingale-settings__status-row'>
                                <Text size='xs'>{localize('Martingale Level')}:</Text>
                                <Text size='xs' weight='bold'>
                                    {store.performance_metrics.martingale_level}
                                </Text>
                            </div>
                            <div className='martingale-settings__status-row'>
                                <Text size='xs'>{localize('Current Stake')}:</Text>
                                <Text size='xs' weight='bold'>
                                    {store.performance_metrics.current_stake.toFixed(2)}
                                </Text>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

MartingaleSettings.displayName = 'MartingaleSettings';
