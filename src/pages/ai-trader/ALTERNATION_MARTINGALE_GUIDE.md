# Alternation and Martingale Integration Guide

## Overview
The AI Trading Bot now supports 6 different alternation modes that work seamlessly with the Martingale system. The direction alternates based on selected trading conditions, and the Martingale stake multiplier is applied independently.

## Alternation Modes

### 1. **None** (Default)
- Bot trades in the same direction (Primary) throughout the session
- No alternation occurs
- Martingale multiplier applies normally to stake increases

### 2. **Every Trade**
- Direction alternates after each completed trade
- Pattern: Primary → Secondary → Primary → Secondary → ...
- Use when: You want to hedge positions or test both directions equally
- Example (Rise/Fall):
  - Trade 1: Rise (Win) → Trade 2: Fall
  - Trade 2: Fall (Loss) → Trade 3: Rise
  - Martingale applies to each new direction

### 3. **On Loss**
- Direction alternates only when the previous trade resulted in a loss
- Pattern: Stay on direction after wins, switch on losses
- Use when: You want to try the opposite direction after losing
- Example (Rise/Fall):
  - Trade 1: Rise (Win) → Trade 2: Rise (same direction)
  - Trade 2: Rise (Loss) → Trade 3: Fall (opposite direction)
  - Martingale will increase stake on losses AND alternate direction

### 4. **On Win**
- Direction alternates only when the previous trade resulted in a win
- Pattern: Stay on direction after losses, switch on wins
- Use when: You want to lock in profits by trying opposite direction
- Example (Rise/Fall):
  - Trade 1: Rise (Win) → Trade 2: Fall (opposite direction)
  - Trade 2: Fall (Loss) → Trade 3: Fall (same direction)
  - Stake returns to base after win if reset_after_win is enabled

### 5. **On Recovery**
- Direction alternates when transitioning from losing streak to winning streak
- Pattern: Continues direction during streaks, switches at transition points
- Use when: You want to confirm recovery with opposite direction
- Example (Rise/Fall):
  - Trade 1-2: Rise (Loss, Loss) → Trade 3: Rise (Win) → Direction alternates to Fall
  - Trade 3-4: Fall (Win, Win) → Stays on Fall
  - Martingale resets on win if enabled

### 6. **Consecutive Losses** (Configurable)
- Direction alternates after reaching a specified threshold of consecutive losses
- Threshold range: 1-10 losses
- Use when: You want to switch strategy after a certain number of consecutive losses
- Example (Rise/Fall, threshold=2):
  - Trade 1: Rise (Loss) → Consecutive losses = 1
  - Trade 2: Rise (Loss) → Consecutive losses = 2 → Alternate to Fall
  - Trade 3: Fall (Loss) → Consecutive losses = 1 (counter resets)
  - Martingale continues applying to all losses

## How Alternation Interacts with Martingale

### Key Points:
1. **Independent Systems**: Alternation and Martingale work independently
2. **Direction Switching**: Alternation changes the contract direction (Rise/Fall, Higher/Lower, etc.)
3. **Stake Increase**: Martingale applies to the new direction after alternation
4. **Reset Behavior**: `reset_after_win` still applies regardless of direction alternation

### Example Scenario: On Loss + Martingale (Multiplier 2, Max 3)

**Setup:**
- Trade Type: Rise/Fall
- Alternation: On Loss
- Martingale: Enabled, Multiplier 2, Max Increase 3, Reset After Win: True
- Base Stake: 10

**Execution:**

```
Trade 1: Rise, Stake 10
  → Loss, Martingale Level 0→1, Next Stake: 20

Trade 2: Fall (alternated), Stake 20
  → Loss, Martingale Level 1→2, Next Stake: 40

Trade 3: Rise (alternated), Stake 40
  → Loss, Martingale Level 2→3, Next Stake: 80

Trade 4: Fall (alternated), Stake 80
  → Loss, Martingale Level 3 (max reached), Stake stays 80

Trade 5: Rise (alternated), Stake 80
  → Win, Martingale Level 0→reset, Next Stake: 10
       Direction stays on Rise (no alternation on win in this mode)

Trade 6: Rise, Stake 10
  → Loss, Martingale Level 0→1, Next Stake: 20
```

### Example Scenario: Every Trade + Martingale

**Setup:**
- Trade Type: Rise/Fall
- Alternation: Every Trade
- Martingale: Enabled, Multiplier 1.5, Max Increase 4, Reset After Win: False
- Base Stake: 10

**Execution:**

```
Trade 1: Rise, Stake 10
  → Win, No Martingale increase (win), Direction alternates to Fall

Trade 2: Fall, Stake 10
  → Loss, Martingale Level 0→1, Stake: 15, Direction alternates to Rise

Trade 3: Rise, Stake 15
  → Loss, Martingale Level 1→2, Stake: 22.5, Direction alternates to Fall

Trade 4: Fall, Stake 22.5
  → Win, Martingale stays (no reset), Direction alternates to Rise

Trade 5: Rise, Stake 22.5
  → Loss, Martingale Level 2→3, Stake: 33.75, Direction alternates to Fall
```

## Testing Checklist

- [ ] **None Mode**: Verify direction stays Primary throughout session
- [ ] **Every Trade**: Verify direction alternates after each trade
- [ ] **On Loss**: Verify direction only changes after losses
- [ ] **On Win**: Verify direction only changes after wins
- [ ] **On Recovery**: Verify direction changes at losing→winning transition
- [ ] **Consecutive Losses**: Verify direction changes after threshold
- [ ] **Martingale with Alternation**: Verify stakes increase correctly with direction changes
- [ ] **Reset After Win**: Verify martingale level resets while direction alternates properly
- [ ] **Display**: Verify current direction shows in Live Trading Monitor
- [ ] **Indicators**: Verify alternation status displays correctly

## Implementation Details

### Store Methods:

1. **`shouldAlternate()`**: Evaluates if alternation should occur based on current mode
2. **`getNextDirection()`**: Returns current direction, updates if alternation needed
3. **`recordTrade()`**: Tracks win/loss and calls `getNextDirection()` automatically

### Direction Helper:

- `getDirectionLabel(tradeType, direction)`: Returns readable direction label
- `TRADE_TYPE_DIRECTIONS`: Maps all 4 trade types to primary/secondary directions

### Trade Type Mappings:

```
Rise/Fall → Rise (primary) / Fall (secondary)
Higher/Lower → Higher (primary) / Lower (secondary)
Odd/Even → Odd (primary) / Even (secondary)
Match/Differs → Matches (primary) / Differs (secondary)
```

## Notes

- Direction resets to 'primary' when starting a new trading session
- Consecutive losses counter tracks losses in current direction sequence
- Current direction always displayed in Live Trading Monitor when trading
- Alternation settings can be changed between sessions but not during active trading
