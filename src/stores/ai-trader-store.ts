import { action, makeAutoObservable, observable } from 'mobx';

export type TVolatilityIndex = 'Volatility 10' | 'Volatility 25' | 'Volatility 50' | 'Volatility 100' | 'Volatility Index';

export type TTradeType = 'Rise/Fall' | 'Higher/Lower' | 'Odd/Even' | 'Match/Differs';

export type TPredictionType = 'random' | 'last_tick' | 'trend_analysis';

export interface IAITraderSettings {
    is_enabled: boolean;
    volatility_index: TVolatilityIndex;
    trade_type: TTradeType;
    stake_amount: number;
    number_of_ticks: number;
    prediction_type: TPredictionType;
    timeout_between_trades: number; // milliseconds
}

export interface IRiskManagement {
    max_loss_limit: number;
    max_win_limit: number | null;
    max_stake_limit: number;
    min_account_balance: number;
    max_consecutive_losses: number;
    max_daily_trades: number;
}

export interface IMartingaleSettings {
    is_enabled: boolean;
    multiplier: number;
    max_increase: number; // max number of consecutive increases
    reset_after_win: boolean;
}

export interface ITradeRecord {
    id: string;
    entry_time: number;
    exit_time: number;
    entry_price: number;
    exit_price: number;
    trade_type: string;
    stake: number;
    profit_loss: number;
    is_win: boolean;
}

export interface IPerformanceMetrics {
    total_trades: number;
    total_wins: number;
    total_losses: number;
    win_rate: number; // percentage
    total_profit_loss: number;
    largest_win: number;
    largest_loss: number;
    current_streak: number; // positive for wins, negative for losses
    current_stake: number;
    martingale_level: number;
}

export default class AITraderStore {
    // Settings
    settings: IAITraderSettings = {
        is_enabled: false,
        volatility_index: 'Volatility 25',
        trade_type: 'Rise/Fall',
        stake_amount: 10,
        number_of_ticks: 5,
        prediction_type: 'random',
        timeout_between_trades: 1000,
    };

    // Risk Management
    risk_management: IRiskManagement = {
        max_loss_limit: 1000,
        max_win_limit: null,
        max_stake_limit: 100,
        min_account_balance: 50,
        max_consecutive_losses: 5,
        max_daily_trades: 100,
    };

    // Martingale
    martingale: IMartingaleSettings = {
        is_enabled: false,
        multiplier: 2,
        max_increase: 5,
        reset_after_win: true,
    };

    // Trading State
    is_trading = false;
    is_waiting_for_trade = false;
    current_tick: number | null = null;
    last_tick_direction: 'up' | 'down' | null = null;
    active_trade: ITradeRecord | null = null;
    ticks_remaining: number = 0;
    session_start_balance: number = 0;
    session_start_time: number = 0;

    // Performance
    trade_history: ITradeRecord[] = [];
    performance_metrics: IPerformanceMetrics = {
        total_trades: 0,
        total_wins: 0,
        total_losses: 0,
        win_rate: 0,
        total_profit_loss: 0,
        largest_win: 0,
        largest_loss: 0,
        current_streak: 0,
        current_stake: 10,
        martingale_level: 0,
    };

    // Error state
    error_message: string = '';
    has_error: boolean = false;

    constructor() {
        makeAutoObservable(this, {
            settings: observable,
            risk_management: observable,
            martingale: observable,
            is_trading: observable,
            is_waiting_for_trade: observable,
            current_tick: observable,
            last_tick_direction: observable,
            active_trade: observable,
            ticks_remaining: observable,
            session_start_balance: observable,
            session_start_time: observable,
            trade_history: observable,
            performance_metrics: observable,
            error_message: observable,
            has_error: observable,
            updateSettings: action,
            updateRiskManagement: action,
            updateMartingaleSettings: action,
            startTrading: action,
            stopTrading: action,
            setCurrentTick: action,
            setActiveTrade: action,
            recordTrade: action,
            updatePerformanceMetrics: action,
            setError: action,
            clearError: action,
            resetSession: action,
            updateMartingaleLevel: action,
        });
    }

    // Settings actions
    updateSettings(key: keyof IAITraderSettings, value: any) {
        this.settings = { ...this.settings, [key]: value };
    }

    updateRiskManagement(key: keyof IRiskManagement, value: any) {
        this.risk_management = { ...this.risk_management, [key]: value };
    }

    updateMartingaleSettings(key: keyof IMartingaleSettings, value: any) {
        this.martingale = { ...this.martingale, [key]: value };
    }

    // Trading actions
    startTrading(initialBalance: number) {
        if (!this.validateSettings()) return;

        this.is_trading = true;
        this.is_waiting_for_trade = true;
        this.session_start_balance = initialBalance;
        this.session_start_time = Date.now();
        this.performance_metrics = {
            total_trades: 0,
            total_wins: 0,
            total_losses: 0,
            win_rate: 0,
            total_profit_loss: 0,
            largest_win: 0,
            largest_loss: 0,
            current_streak: 0,
            current_stake: this.settings.stake_amount,
            martingale_level: 0,
        };
        this.clearError();
    }

    stopTrading() {
        this.is_trading = false;
        this.is_waiting_for_trade = false;
        this.active_trade = null;
    }

    setCurrentTick(value: number, previous_value: number | null) {
        this.current_tick = value;
        if (previous_value !== null) {
            this.last_tick_direction = value > previous_value ? 'up' : 'down';
        }
    }

    setActiveTrade(trade: ITradeRecord | null) {
        this.active_trade = trade;
        if (trade) {
            this.ticks_remaining = this.settings.number_of_ticks;
            this.is_waiting_for_trade = false;
        }
    }

    recordTrade(trade: ITradeRecord) {
        this.trade_history.push(trade);
        this.updatePerformanceMetrics(trade);
        this.is_waiting_for_trade = true;

        // Reset martingale if win and reset_after_win is enabled
        if (trade.is_win && this.martingale.reset_after_win) {
            this.performance_metrics.martingale_level = 0;
            this.performance_metrics.current_stake = this.settings.stake_amount;
        }
    }

    updatePerformanceMetrics(trade: ITradeRecord) {
        const metrics = this.performance_metrics;

        metrics.total_trades += 1;
        metrics.total_profit_loss += trade.profit_loss;

        if (trade.is_win) {
            metrics.total_wins += 1;
            metrics.current_streak = metrics.current_streak > 0 ? metrics.current_streak + 1 : 1;
        } else {
            metrics.total_losses += 1;
            metrics.current_streak = metrics.current_streak < 0 ? metrics.current_streak - 1 : -1;

            // Apply martingale multiplier on loss
            if (this.martingale.is_enabled && metrics.martingale_level < this.martingale.max_increase) {
                metrics.martingale_level += 1;
                metrics.current_stake = Math.round(
                    this.settings.stake_amount * Math.pow(this.martingale.multiplier, metrics.martingale_level)
                );
            }
        }

        // Update largest win/loss
        if (trade.profit_loss > 0 && trade.profit_loss > metrics.largest_win) {
            metrics.largest_win = trade.profit_loss;
        }
        if (trade.profit_loss < 0 && trade.profit_loss < metrics.largest_loss) {
            metrics.largest_loss = trade.profit_loss;
        }

        // Calculate win rate
        metrics.win_rate = metrics.total_trades > 0 ? (metrics.total_wins / metrics.total_trades) * 100 : 0;
    }

    updateMartingaleLevel() {
        if (this.martingale.is_enabled && this.performance_metrics.martingale_level < this.martingale.max_increase) {
            this.performance_metrics.martingale_level += 1;
            this.performance_metrics.current_stake = Math.round(
                this.settings.stake_amount * Math.pow(this.martingale.multiplier, this.performance_metrics.martingale_level)
            );
        }
    }

    setError(message: string) {
        this.error_message = message;
        this.has_error = true;
    }

    clearError() {
        this.error_message = '';
        this.has_error = false;
    }

    resetSession() {
        this.stopTrading();
        this.trade_history = [];
        this.performance_metrics = {
            total_trades: 0,
            total_wins: 0,
            total_losses: 0,
            win_rate: 0,
            total_profit_loss: 0,
            largest_win: 0,
            largest_loss: 0,
            current_streak: 0,
            current_stake: this.settings.stake_amount,
            martingale_level: 0,
        };
        this.active_trade = null;
        this.current_tick = null;
        this.last_tick_direction = null;
        this.clearError();
    }

    // Validation
    private validateSettings(): boolean {
        if (this.settings.stake_amount <= 0) {
            this.setError('Stake amount must be greater than 0');
            return false;
        }

        if (this.settings.stake_amount > this.risk_management.max_stake_limit) {
            this.setError('Stake amount exceeds maximum limit');
            return false;
        }

        if (this.settings.number_of_ticks < 1 || this.settings.number_of_ticks > 10) {
            this.setError('Number of ticks must be between 1 and 10');
            return false;
        }

        return true;
    }

    // Getters for computed values
    get session_duration(): number {
        return this.is_trading ? Date.now() - this.session_start_time : 0;
    }

    get current_balance(): number {
        return this.session_start_balance + this.performance_metrics.total_profit_loss;
    }

    get should_stop_trading(): boolean {
        const metrics = this.performance_metrics;
        const balance = this.current_balance;

        // Check max loss limit
        if (metrics.total_profit_loss < -this.risk_management.max_loss_limit) {
            return true;
        }

        // Check max win limit
        if (
            this.risk_management.max_win_limit &&
            metrics.total_profit_loss > this.risk_management.max_win_limit
        ) {
            return true;
        }

        // Check max consecutive losses
        if (Math.abs(metrics.current_streak) > this.risk_management.max_consecutive_losses) {
            return true;
        }

        // Check max daily trades
        if (metrics.total_trades >= this.risk_management.max_daily_trades) {
            return true;
        }

        // Check minimum account balance
        if (balance < this.risk_management.min_account_balance) {
            return true;
        }

        return false;
    }
}
