import React from 'react';
import { observer } from 'mobx-react-lite';
import { Checkbox, Dropdown, Input } from '@deriv-com/ui';
import { useTranslations } from '@deriv-com/translations';
import AITraderStore, { TAlternationMode } from '@/stores/ai-trader-store';
import { IComponentProps } from '../types/ai-trader.types';
import './alternation-settings.scss';

interface IAlternationSettingsProps extends IComponentProps {
    store: AITraderStore;
}

const ALTERNATION_MODE_OPTIONS = [
    { value: 'none', label: 'None' },
    { value: 'every_trade', label: 'Alternate Every Trade' },
    { value: 'on_loss', label: 'Alternate On Loss' },
    { value: 'on_win', label: 'Alternate On Win' },
    { value: 'on_recovery', label: 'Alternate On Recovery' },
    { value: 'consecutive_losses', label: 'Alternate On Consecutive Losses' },
];

export const AlternationSettings = observer(({ store, className }: IAlternationSettingsProps) => {
    const { localize } = useTranslations();

    const handleToggleAlternation = (value: boolean) => {
        store.updateAlternationSettings('is_enabled', value);
    };

    const handleModeChange = (value: string) => {
        store.updateAlternationSettings('mode', value as TAlternationMode);
    };

    const handleConsecutiveLossesChange = (value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
            store.updateAlternationSettings('consecutive_losses_threshold', numValue);
        }
    };

    return (
        <div className={`alternation-settings ${className || ''}`}>
            <div className='alternation-settings__header'>
                <h3 className='alternation-settings__title'>{localize('Direction Alternation')}</h3>
                <Checkbox
                    value='enabled'
                    label={localize('Enable Alternation')}
                    onChange={(e) => handleToggleAlternation(e.target.checked)}
                    checked={store.alternation.is_enabled}
                    className='alternation-settings__checkbox'
                />
            </div>

            {store.alternation.is_enabled && (
                <>
                    <div className='alternation-settings__field'>
                        <label className='alternation-settings__label'>
                            {localize('Alternation Mode')}
                        </label>
                        <Dropdown
                            list={ALTERNATION_MODE_OPTIONS}
                            value={store.alternation.mode}
                            onChange={handleModeChange}
                            variant='prompt'
                            has_symbol={false}
                            is_align_text_left
                        />
                        <p className='alternation-settings__description'>
                            {getAlternationModeDescription(store.alternation.mode, localize)}
                        </p>
                    </div>

                    {store.alternation.mode === 'consecutive_losses' && (
                        <div className='alternation-settings__field'>
                            <label className='alternation-settings__label'>
                                {localize('Consecutive Losses Threshold')}
                            </label>
                            <Input
                                type='number'
                                value={store.alternation.consecutive_losses_threshold.toString()}
                                onChange={(e) => handleConsecutiveLossesChange(e.target.value)}
                                min={1}
                                max={10}
                                placeholder='2'
                            />
                            <p className='alternation-settings__description'>
                                {localize(
                                    'Bot will alternate direction after reaching this many consecutive losses'
                                )}
                            </p>
                        </div>
                    )}

                    <div className='alternation-settings__info'>
                        <div className='alternation-settings__info-item'>
                            <span className='alternation-settings__info-label'>
                                {localize('Current Direction:')}
                            </span>
                            <span className='alternation-settings__info-value'>
                                {store.current_direction === 'primary' ? 'Primary' : 'Secondary'}
                            </span>
                        </div>
                        {store.alternation.mode === 'consecutive_losses' && (
                            <div className='alternation-settings__info-item'>
                                <span className='alternation-settings__info-label'>
                                    {localize('Consecutive Losses:')}
                                </span>
                                <span className='alternation-settings__info-value'>
                                    {store.consecutive_losses_counter}
                                </span>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
});

AlternationSettings.displayName = 'AlternationSettings';

/**
 * Get user-friendly description for each alternation mode
 */
function getAlternationModeDescription(mode: TAlternationMode, localize: any): string {
    const descriptions: Record<TAlternationMode, string> = {
        none: 'Bot will always trade in the same direction',
        every_trade: 'Bot alternates direction after every completed trade',
        on_loss: 'Bot alternates direction only after losing a trade',
        on_win: 'Bot alternates direction only after winning a trade',
        on_recovery: 'Bot alternates direction when transitioning from losing to winning',
        consecutive_losses: 'Bot alternates direction after reaching a threshold of consecutive losses',
    };

    return localize(descriptions[mode]);
}
