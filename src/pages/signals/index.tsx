import React from 'react';
import './signals.scss';

const SIGNALS = [
    {
        symbol: 'Volatility 100',
        market: 'Synthetic Indices',
        icon: 'VOL',
        iconClass: 'vol',
        type: 'buy',
        entry: '1,248.45',
        tp: '1,261.20',
        sl: '1,241.00',
        strength: 84,
        time: '2 min ago',
    },
    {
        symbol: 'EUR/USD',
        market: 'Forex',
        icon: '€$',
        iconClass: 'eur',
        type: 'sell',
        entry: '1.08432',
        tp: '1.08100',
        sl: '1.08650',
        strength: 72,
        time: '5 min ago',
    },
    {
        symbol: 'GBP/USD',
        market: 'Forex',
        icon: '£$',
        iconClass: 'gbp',
        type: 'sell',
        entry: '1.27840',
        tp: '1.27400',
        sl: '1.28100',
        strength: 65,
        time: '8 min ago',
    },
    {
        symbol: 'Gold/USD',
        market: 'Commodities',
        icon: 'XAU',
        iconClass: 'xau',
        type: 'buy',
        entry: '2,318.50',
        tp: '2,334.00',
        sl: '2,309.00',
        strength: 91,
        time: '12 min ago',
    },
    {
        symbol: 'BTC/USD',
        market: 'Crypto',
        icon: '₿',
        iconClass: 'btc',
        type: 'buy',
        entry: '67,420',
        tp: '69,500',
        sl: '65,800',
        strength: 77,
        time: '15 min ago',
    },
    {
        symbol: 'USD/JPY',
        market: 'Forex',
        icon: '$¥',
        iconClass: 'jpy',
        type: 'buy',
        entry: '151.240',
        tp: '152.800',
        sl: '150.500',
        strength: 60,
        time: '22 min ago',
    },
];

const NEWS = [
    {
        title: 'Fed holds rates steady, signals two cuts possible in 2025',
        time: '09:30 GMT',
        currencies: ['USD', 'EUR'],
        impact: 'high',
    },
    {
        title: 'UK CPI inflation falls to 2.8%, near Bank of England target',
        time: '07:00 GMT',
        currencies: ['GBP'],
        impact: 'high',
    },
    {
        title: 'Gold demand rises on global central bank purchases',
        time: '06:15 GMT',
        currencies: ['XAU'],
        impact: 'medium',
    },
    {
        title: 'Bitcoin ETF inflows hit record $650M in a single day',
        time: '05:00 GMT',
        currencies: ['BTC'],
        impact: 'medium',
    },
    {
        title: 'Japan BoJ keeps ultra-loose policy unchanged',
        time: '03:30 GMT',
        currencies: ['JPY'],
        impact: 'low',
    },
];

const SENTIMENTS = [
    { label: 'Forex', value: 62, tag: 'Bullish', tagClass: 'bull', arcColor: '#4caf50' },
    { label: 'Crypto', value: 78, tag: 'Bullish', tagClass: 'bull', arcColor: '#4caf50' },
    { label: 'Volatility', value: 48, tag: 'Neutral', tagClass: 'neutral', arcColor: '#c9a84c' },
];

const Signals: React.FC = () => {
    const arcPath = (value: number, color: string) => {
        const r = 40;
        const cx = 50;
        const cy = 50;
        const startAngle = Math.PI;
        const endAngle = Math.PI + (value / 100) * Math.PI;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = value > 50 ? 1 : 0;
        return (
            <>
                <path
                    d={`M ${cx + r * Math.cos(Math.PI)} ${cy + r * Math.sin(Math.PI)} A ${r} ${r} 0 1 1 ${cx + r * Math.cos(0)} ${cy + r * Math.sin(0)}`}
                    fill='none'
                    stroke='var(--general-section-3)'
                    strokeWidth='8'
                    strokeLinecap='round'
                />
                <path
                    d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
                    fill='none'
                    stroke={color}
                    strokeWidth='8'
                    strokeLinecap='round'
                />
            </>
        );
    };

    return (
        <div className='signals'>
            <div className='signals__header'>
                <div className='signals__title'>
                    <h1>Market Signals</h1>
                    <span>Real-time indicators · Loree54</span>
                </div>
                <button className='signals__refresh'>⟳ Refresh Signals</button>
            </div>

            <div className='signals__sentiment-row'>
                {SENTIMENTS.map(s => (
                    <div className='signals__sentiment-card' key={s.label}>
                        <div className='signals__sentiment-label'>{s.label} Sentiment</div>
                        <div className='signals__sentiment-gauge'>
                            <svg viewBox='0 0 100 55' width='100' height='55'>
                                {arcPath(s.value, s.arcColor)}
                            </svg>
                        </div>
                        <div className='signals__sentiment-value'>{s.value}%</div>
                        <div className={`signals__sentiment-tag signals__sentiment-tag--${s.tagClass}`}>{s.tag}</div>
                    </div>
                ))}
            </div>

            <h2 className='signals__section-title'>Active Signals</h2>

            <div className='signals__signals-grid'>
                {SIGNALS.map(sig => (
                    <div className={`signals__signal-card signals__signal-card--${sig.type}`} key={sig.symbol}>
                        <div className='signals__signal-header'>
                            <div className='signals__signal-symbol'>
                                <div className={`signals__symbol-icon signals__symbol-icon--${sig.iconClass}`}>{sig.icon}</div>
                                <div>
                                    <div className='signals__symbol-name'>{sig.symbol}</div>
                                    <div className='signals__symbol-market'>{sig.market}</div>
                                </div>
                            </div>
                            <div className={`signals__signal-badge signals__signal-badge--${sig.type}`}>
                                {sig.type.toUpperCase()}
                            </div>
                        </div>

                        <div className='signals__signal-levels'>
                            <div className='signals__signal-level'>
                                <label>Entry</label>
                                <span>{sig.entry}</span>
                            </div>
                            <div className='signals__signal-level signals__signal-level--tp'>
                                <label>Take Profit</label>
                                <span>{sig.tp}</span>
                            </div>
                            <div className='signals__signal-level signals__signal-level--sl'>
                                <label>Stop Loss</label>
                                <span>{sig.sl}</span>
                            </div>
                        </div>

                        <div className='signals__signal-strength'>
                            <label>
                                Signal Strength <span>{sig.strength}%</span>
                            </label>
                            <div className='signals__strength-bar'>
                                <div
                                    className={`signals__strength-bar-fill signals__strength-bar-fill--${sig.type}`}
                                    style={{ width: `${sig.strength}%` }}
                                />
                            </div>
                        </div>

                        <div className='signals__signal-time'>{sig.time}</div>
                    </div>
                ))}
            </div>

            <h2 className='signals__section-title'>Economic Calendar</h2>

            <div className='signals__news-card'>
                <div className='signals__news-list'>
                    {NEWS.map((item, i) => (
                        <div className='signals__news-item' key={i}>
                            <div className={`signals__news-impact signals__news-impact--${item.impact}`} />
                            <div className='signals__news-content'>
                                <div className='signals__news-title'>{item.title}</div>
                                <div className='signals__news-meta'>
                                    <span>{item.time}</span>
                                    <span>Impact: {item.impact.charAt(0).toUpperCase() + item.impact.slice(1)}</span>
                                </div>
                            </div>
                            <div className='signals__news-currencies'>
                                {item.currencies.map(c => (
                                    <span className='signals__currency-tag' key={c}>{c}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Signals;
