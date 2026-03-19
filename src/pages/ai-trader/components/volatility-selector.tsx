import React from 'react';
import { observer } from 'mobx-react-lite';
import { Dropdown } from '@deriv-com/ui';
import { useTranslations } from '@deriv-com/translations';
import AITraderStore, { TVolatilityIndex } from '@/stores/ai-trader-store';
import { IComponentProps } from '../types/ai-trader.types';
import './volatility-selector.scss';

interface IVolatilitySelectorProps extends IComponentProps {
    store: AITraderStore;
}

const VOLATILITY_OPTIONS = [
    { value: 'Volatility 10', label: 'Volatility 10' },
    { value: 'Volatility 25', label: 'Volatility 25' },
    { value: 'Volatility 50', label: 'Volatility 50' },
    { value: 'Volatility 100', label: 'Volatility 100' },
    { value: 'Volatility Index', label: 'Volatility Index' },
];

export const VolatilitySelector = observer(({ store, className }: IVolatilitySelectorProps) => {
    const { localize } = useTranslations();

    const handleChange = (value: string) => {
        store.updateSettings('volatility_index', value as TVolatilityIndex);
    };

    return (
        <div className={`volatility-selector ${className || ''}`}>
            <label className='volatility-selector__label'>{localize('Volatility Index')}</label>
            <Dropdown
                list={VOLATILITY_OPTIONS}
                value={store.settings.volatility_index}
                onChange={handleChange}
                variant='prompt'
                has_symbol={false}
                is_align_text_left
            />
        </div>
    );
});

VolatilitySelector.displayName = 'VolatilitySelector';
