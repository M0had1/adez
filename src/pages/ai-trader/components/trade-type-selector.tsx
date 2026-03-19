import React from 'react';
import { observer } from 'mobx-react-lite';
import { Dropdown } from '@deriv-com/ui';
import { useTranslations } from '@deriv-com/translations';
import AITraderStore, { TTradeType } from '@/stores/ai-trader-store';
import { IComponentProps } from '../types/ai-trader.types';
import './trade-type-selector.scss';

interface ITradeTypeSelectorProps extends IComponentProps {
    store: AITraderStore;
}

const TRADE_TYPE_OPTIONS = [
    { value: 'Rise/Fall', label: 'Rise/Fall' },
    { value: 'Higher/Lower', label: 'Higher/Lower' },
    { value: 'Odd/Even', label: 'Odd/Even' },
    { value: 'Match/Differs', label: 'Match/Differs' },
];

export const TradeTypeSelector = observer(({ store, className }: ITradeTypeSelectorProps) => {
    const { localize } = useTranslations();

    const handleChange = (value: string) => {
        store.updateSettings('trade_type', value as TTradeType);
    };

    return (
        <div className={`trade-type-selector ${className || ''}`}>
            <label className='trade-type-selector__label'>{localize('Trade Type')}</label>
            <Dropdown
                list={TRADE_TYPE_OPTIONS}
                value={store.settings.trade_type}
                onChange={handleChange}
                variant='prompt'
                has_symbol={false}
                is_align_text_left
            />
        </div>
    );
});

TradeTypeSelector.displayName = 'TradeTypeSelector';
