import { TTradeType } from '@/stores/ai-trader-store';

export type TDirection = 'primary' | 'secondary';

/**
 * Maps trade types to their primary and secondary directions
 * For alternation purposes
 */
export const TRADE_TYPE_DIRECTIONS: Record<TTradeType, { primary: string; secondary: string }> = {
    'Rise/Fall': {
        primary: 'Rise',
        secondary: 'Fall',
    },
    'Higher/Lower': {
        primary: 'Higher',
        secondary: 'Lower',
    },
    'Odd/Even': {
        primary: 'Odd',
        secondary: 'Even',
    },
    'Match/Differs': {
        primary: 'Matches',
        secondary: 'Differs',
    },
};

/**
 * Get the current direction label based on trade type and direction type
 */
export const getDirectionLabel = (tradeType: TTradeType, direction: TDirection): string => {
    const directions = TRADE_TYPE_DIRECTIONS[tradeType];
    return direction === 'primary' ? directions.primary : directions.secondary;
};

/**
 * Flip between primary and secondary direction
 */
export const getAlternateDirection = (currentDirection: TDirection): TDirection => {
    return currentDirection === 'primary' ? 'secondary' : 'primary';
};

/**
 * Get the opposite direction with full label
 */
export const getOppositeDirectionLabel = (tradeType: TTradeType, currentDirection: TDirection): string => {
    const oppositeDirection = getAlternateDirection(currentDirection);
    return getDirectionLabel(tradeType, oppositeDirection);
};
