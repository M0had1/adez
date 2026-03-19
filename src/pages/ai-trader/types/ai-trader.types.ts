export type TVolatilityIndex = 'Volatility 10' | 'Volatility 25' | 'Volatility 50' | 'Volatility 100' | 'Volatility Index';
export type TTradeType = 'Rise/Fall' | 'Higher/Lower' | 'Odd/Even' | 'Match/Differs';
export type TPredictionType = 'random' | 'last_tick' | 'trend_analysis';

export interface IComponentProps {
    className?: string;
}
