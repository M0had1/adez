import './splash-screen.scss';

export default function ChunkLoader({ message: _ }: { message?: string }) {
    return (
        <div className='splash-screen'>
            <div className='splash-screen__vault-wrapper'>
                <svg
                    className='splash-screen__vault-spin'
                    viewBox='0 0 160 160'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <defs>
                        <radialGradient id='vaultBody' cx='40%' cy='35%' r='65%'>
                            <stop offset='0%' stopColor='#3a3a5c' />
                            <stop offset='60%' stopColor='#1a1a2e' />
                            <stop offset='100%' stopColor='#0e0e1a' />
                        </radialGradient>
                        <radialGradient id='outerRing' cx='50%' cy='50%' r='50%'>
                            <stop offset='70%' stopColor='#c9a84c' />
                            <stop offset='85%' stopColor='#e2c97e' />
                            <stop offset='100%' stopColor='#8a6a1a' />
                        </radialGradient>
                        <filter id='goldGlow'>
                            <feGaussianBlur stdDeviation='2' result='blur' />
                            <feMerge>
                                <feMergeNode in='blur' />
                                <feMergeNode in='SourceGraphic' />
                            </feMerge>
                        </filter>
                    </defs>

                    <circle cx='80' cy='80' r='76' fill='url(#outerRing)' />
                    <circle cx='80' cy='80' r='70' fill='#0e0e1a' />
                    <circle cx='80' cy='80' r='64' fill='url(#vaultBody)' />

                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
                        const rad = (angle * Math.PI) / 180;
                        const x1 = 80 + 68 * Math.cos(rad);
                        const y1 = 80 + 68 * Math.sin(rad);
                        const x2 = 80 + 74 * Math.cos(rad);
                        const y2 = 80 + 74 * Math.sin(rad);
                        return (
                            <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={i % 3 === 0 ? '#e2c97e' : '#8a6a1a'}
                                strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
                            />
                        );
                    })}

                    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                        const rad = (angle * Math.PI) / 180;
                        const x1 = 80 + 22 * Math.cos(rad);
                        const y1 = 80 + 22 * Math.sin(rad);
                        const x2 = 80 + 54 * Math.cos(rad);
                        const y2 = 80 + 54 * Math.sin(rad);
                        return (
                            <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke='#c9a84c'
                                strokeWidth='4'
                                strokeLinecap='round'
                                filter='url(#goldGlow)'
                            />
                        );
                    })}

                    <circle cx='80' cy='80' r='56' fill='none' stroke='#c9a84c' strokeWidth='1' strokeOpacity='0.4' />
                    <circle cx='80' cy='80' r='20' fill='none' stroke='#c9a84c' strokeWidth='2' />
                    <circle cx='80' cy='80' r='14' fill='#1a1a2e' stroke='#e2c97e' strokeWidth='1.5' />
                </svg>

                <div className='splash-screen__vault-center'>
                    <div className='splash-screen__vault-handle' />
                </div>
            </div>

            <div className='splash-screen__title'>Loree54</div>
            <div className='splash-screen__subtitle'>Powered by Deriv Bot</div>
        </div>
    );
}
