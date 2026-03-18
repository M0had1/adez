import React from 'react';
import './performance.scss';

const WEEKLY_DATA = [
    { day: 'Mon', pnl: 42, positive: true },
    { day: 'Tue', pnl: -18, positive: false },
    { day: 'Wed', pnl: 67, positive: true },
    { day: 'Thu', pnl: 91, positive: true },
    { day: 'Fri', pnl: -23, positive: false },
    { day: 'Sat', pnl: 54, positive: true },
    { day: 'Sun', pnl: 38, positive: true },
];

const RECENT_TRADES = [
    { id: 1, symbol: 'Volatility 100', type: 'Rise', duration: '5 min', stake: '$10.00', pnl: '+$8.73', pos: true, time: '14:32' },
    { id: 2, symbol: 'EUR/USD', type: 'Fall', duration: '1 min', stake: '$5.00', pnl: '-$5.00', pos: false, time: '14:18' },
    { id: 3, symbol: 'Gold/USD', type: 'Rise', duration: '15 min', stake: '$20.00', pnl: '+$17.40', pos: true, time: '13:55' },
    { id: 4, symbol: 'Volatility 75', type: 'Rise', duration: '5 min', stake: '$15.00', pnl: '+$13.10', pos: true, time: '13:20' },
    { id: 5, symbol: 'BTC/USD', type: 'Fall', duration: '1 min', stake: '$10.00', pnl: '-$10.00', pos: false, time: '12:48' },
];

const maxAbsBar = Math.max(...WEEKLY_DATA.map(d => Math.abs(d.pnl)));

const WIN_RATE = 71;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 48;

const Performance: React.FC = () => {
    return (
        <div className='performance'>
            <div className='performance__header'>
                <div className='performance__title'>
                    <h1>Performance Analytics</h1>
                    <span>LOREE54 · Live Account</span>
                </div>
                <div className='performance__badge'>LIVE</div>
            </div>

            <div className='performance__stats-grid'>
                <div className='performance__stat-card performance__stat-card--gold'>
                    <div className='performance__stat-label'>Total Trades</div>
                    <div className='performance__stat-value performance__stat-value--gold'>1,284</div>
                    <div className='performance__stat-sub performance__stat-sub--up'>↑ 48 this week</div>
                </div>
                <div className='performance__stat-card performance__stat-card--green'>
                    <div className='performance__stat-label'>Win Rate</div>
                    <div className='performance__stat-value performance__stat-value--positive'>71.3%</div>
                    <div className='performance__stat-sub performance__stat-sub--up'>↑ 2.1% vs last week</div>
                </div>
                <div className='performance__stat-card performance__stat-card--blue'>
                    <div className='performance__stat-label'>Total P&L</div>
                    <div className='performance__stat-value performance__stat-value--positive'>+$4,821</div>
                    <div className='performance__stat-sub performance__stat-sub--up'>↑ $271 this week</div>
                </div>
                <div className='performance__stat-card performance__stat-card--purple'>
                    <div className='performance__stat-label'>Avg Duration</div>
                    <div className='performance__stat-value'>4.7 min</div>
                    <div className='performance__stat-sub'>per trade</div>
                </div>
            </div>

            <div className='performance__charts-row'>
                <div className='performance__card'>
                    <h3>Weekly P&L</h3>
                    <div className='performance__bar-chart'>
                        {WEEKLY_DATA.map(({ day, pnl, positive }) => {
                            const pct = (Math.abs(pnl) / maxAbsBar) * 140;
                            return (
                                <div className='performance__bar-group' key={day}>
                                    <div
                                        className={`performance__bar performance__bar--${positive ? 'positive' : 'negative'}`}
                                        style={{ height: `${pct}px` }}
                                        title={`${positive ? '+' : ''}$${pnl}`}
                                    />
                                    <div className='performance__bar-label'>{day}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className='performance__card'>
                    <h3>Win / Loss Ratio</h3>
                    <div className='performance__donut-wrapper'>
                        <div className='performance__donut'>
                            <svg viewBox='0 0 120 120' width='120' height='120'>
                                <circle cx='60' cy='60' r='48' fill='none' stroke='var(--general-section-3)' strokeWidth='12' />
                                <circle
                                    cx='60'
                                    cy='60'
                                    r='48'
                                    fill='none'
                                    stroke='#4caf50'
                                    strokeWidth='12'
                                    strokeDasharray={`${(WIN_RATE / 100) * CIRCLE_CIRCUMFERENCE} ${CIRCLE_CIRCUMFERENCE}`}
                                    strokeLinecap='round'
                                    style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
                                />
                                <circle
                                    cx='60'
                                    cy='60'
                                    r='48'
                                    fill='none'
                                    stroke='#f44336'
                                    strokeWidth='12'
                                    strokeDasharray={`${((100 - WIN_RATE) / 100) * CIRCLE_CIRCUMFERENCE} ${CIRCLE_CIRCUMFERENCE}`}
                                    strokeDashoffset={-((WIN_RATE / 100) * CIRCLE_CIRCUMFERENCE)}
                                    strokeLinecap='round'
                                    style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
                                />
                            </svg>
                            <div className='performance__donut-label'>
                                <strong>{WIN_RATE}%</strong>
                                <span>wins</span>
                            </div>
                        </div>
                        <div className='performance__donut-legend'>
                            <div className='performance__legend-item'>
                                <span>
                                    <span className='performance__legend-dot performance__legend-dot--green' />
                                    Wins
                                </span>
                                <span>916</span>
                            </div>
                            <div className='performance__legend-item'>
                                <span>
                                    <span className='performance__legend-dot performance__legend-dot--red' />
                                    Losses
                                </span>
                                <span>368</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='performance__card'>
                <h3>Recent Trades</h3>
                <table className='performance__trades-table'>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Stake</th>
                            <th>P&L</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RECENT_TRADES.map(trade => (
                            <tr key={trade.id}>
                                <td className='performance__trade-symbol'>{trade.symbol}</td>
                                <td>
                                    <span className={`performance__trade-type performance__trade-type--${trade.type.toLowerCase()}`}>
                                        {trade.type}
                                    </span>
                                </td>
                                <td>{trade.duration}</td>
                                <td>{trade.stake}</td>
                                <td className={`performance__trade-pnl performance__trade-pnl--${trade.pos ? 'pos' : 'neg'}`}>
                                    {trade.pnl}
                                </td>
                                <td>{trade.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Performance;
