import React from 'react';
import { observer } from 'mobx-react-lite';
import { Text, Button } from '@deriv-com/ui';
import { useTranslations } from '@deriv-com/translations';
import AITraderStore from '@/stores/ai-trader-store';
import { IComponentProps } from '../types/ai-trader.types';
import './live-trading-monitor.scss';

interface ILiveTradingMonitorProps extends IComponentProps {
    store: AITraderStore;
}

export const LiveTradingMonitor = observer(({ store, className }: ILiveTradingMonitorProps) => {
    const { localize } = useTranslations();

    const getStatusColor = () => {
        if (!store.is_trading) return 'neutral';
        if (store.is_waiting_for_trade) return 'warning';
        if (store.active_trade) return 'success';
        return 'neutral';
    };

    const getStatusText = () => {
        if (!store.is_trading) return localize('Stopped');
        if (store.is_waiting_for_trade) return localize('Waiting for next trade');
        if (store.active_trade) return localize('Trade in progress');
        return localize('Idle');
    };

    const currentBalance = store.current_balance;
    const isProfit = currentBalance >= store.session_start_balance;

    return (
        <div className={`live-trading-monitor ${className || ''}`}>
            <div className='live-trading-monitor__header'>
                <Text as='h2' weight='bold' size='sm'>
                    {localize('Live Trading Monitor')}
                </Text>
            </div>

            <div className='live-trading-monitor__content'>
                {/* Status Section */}
                <div className='live-trading-monitor__section'>
                    <div className={`live-trading-monitor__status live-trading-monitor__status--${getStatusColor()}`}>
                        <div className='live-trading-monitor__status-indicator'></div>
                        <Text weight='bold' size='sm'>
                            {getStatusText()}
                        </Text>
                    </div>
                </div>

                {/* Current Ticker */}
                {store.current_tick !== null && (
                    <div className='live-trading-monitor__section'>
                        <Text size='xs' color='subtle'>
                            {localize('Current Tick')}
                        </Text>
                        <div className='live-trading-monitor__ticker'>
                            <Text as='h3' weight='bold' size='lg'>
                                {store.current_tick.toFixed(2)}
                            </Text>
                            {store.last_tick_direction && (
                                <Text size='sm' className={`live-trading-monitor__direction live-trading-monitor__direction--${store.last_tick_direction}`}>
                                    {store.last_tick_direction === 'up' ? '↑' : '↓'}
                                </Text>
                            )}
                        </div>
                    </div>
                )}

                {/* Active Trade Info */}
                {store.active_trade && (
                    <div className='live-trading-monitor__section'>
                        <Text weight='bold' size='xs'>
                            {localize('Active Trade')}
                        </Text>
                        <div className='live-trading-monitor__trade-info'>
                            <div className='live-trading-monitor__trade-row'>
                                <Text size='xs'>{localize('Entry Price')}:</Text>
                                <Text size='xs' weight='bold'>
                                    {store.active_trade.entry_price.toFixed(2)}
                                </Text>
                            </div>
                            <div className='live-trading-monitor__trade-row'>
                                <Text size='xs'>{localize('Stake')}:</Text>
                                <Text size='xs' weight='bold'>
                                    {store.active_trade.stake.toFixed(2)}
                                </Text>
                            </div>
                            <div className='live-trading-monitor__trade-row'>
                                <Text size='xs'>{localize('Ticks Remaining')}:</Text>
                                <Text size='xs' weight='bold' color='info'>
                                    {store.ticks_remaining}
                                </Text>
                            </div>
                        </div>
                    </div>
                )}

                {/* P&L Summary */}
                <div className='live-trading-monitor__section'>
                    <Text weight='bold' size='xs'>
                        {localize('Session Summary')}
                    </Text>
                    <div className='live-trading-monitor__summary'>
                        <div className='live-trading-monitor__summary-row'>
                            <Text size='xs'>{localize('Starting Balance')}:</Text>
                            <Text size='xs' weight='bold'>
                                {store.session_start_balance.toFixed(2)}
                            </Text>
                        </div>
                        <div className='live-trading-monitor__summary-row'>
                            <Text size='xs'>{localize('Current Balance')}:</Text>
                            <Text size='xs' weight='bold' color={isProfit ? 'profit' : 'loss'}>
                                {currentBalance.toFixed(2)}
                            </Text>
                        </div>
                        <div className={`live-trading-monitor__pnl live-trading-monitor__pnl--${isProfit ? 'profit' : 'loss'}`}>
                            <Text weight='bold' size='sm'>
                                {localize('Total P&L')}:
                            </Text>
                            <Text as='h3' weight='bold' size='lg' color={isProfit ? 'profit' : 'loss'}>
                                {isProfit ? '+' : ''}{store.performance_metrics.total_profit_loss.toFixed(2)}
                            </Text>
                        </div>
                    </div>
                </div>

                {/* Trade Statistics */}
                <div className='live-trading-monitor__section'>
                    <Text weight='bold' size='xs'>
                        {localize('Trade Statistics')}
                    </Text>
                    <div className='live-trading-monitor__stats'>
                        <div className='live-trading-monitor__stat-row'>
                            <Text size='xs'>{localize('Total Trades')}:</Text>
                            <Text size='xs' weight='bold'>
                                {store.performance_metrics.total_trades}
                            </Text>
                        </div>
                        <div className='live-trading-monitor__stat-row'>
                            <Text size='xs'>{localize('Wins/Losses')}:</Text>
                            <Text size='xs' weight='bold'>
                                {store.performance_metrics.total_wins}/{store.performance_metrics.total_losses}
                            </Text>
                        </div>
                        <div className='live-trading-monitor__stat-row'>
                            <Text size='xs'>{localize('Win Rate')}:</Text>
                            <Text size='xs' weight='bold' color='info'>
                                {store.performance_metrics.win_rate.toFixed(2)}%
                            </Text>
                        </div>
                        <div className='live-trading-monitor__stat-row'>
                            <Text size='xs'>{localize('Current Streak')}:</Text>
                            <Text size='xs' weight='bold' color={store.performance_metrics.current_streak >= 0 ? 'profit' : 'loss'}>
                                {store.performance_metrics.current_streak > 0 ? '+' : ''}
                                {store.performance_metrics.current_streak}
                            </Text>
                        </div>
                    </div>
                </div>

                {/* Risk Warnings */}
                {store.should_stop_trading && (
                    <div className='live-trading-monitor__warning'>
                        <Text size='xs' weight='bold' color='loss'>
                            {localize('⚠️ Risk management limit reached. Trading will stop.')}
                        </Text>
                    </div>
                )}
            </div>
        </div>
    );
});

LiveTradingMonitor.displayName = 'LiveTradingMonitor';
