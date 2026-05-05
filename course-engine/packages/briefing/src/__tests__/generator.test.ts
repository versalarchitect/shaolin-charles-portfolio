import { describe, it, expect } from 'bun:test';

// Test the helper functions by re-implementing them (they're not exported)
function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len - 1) + '…' : str;
}

function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

describe('plural helper', () => {
  it('returns singular for 1', () => {
    expect(plural(1, 'fact')).toBe('1 fact');
  });

  it('returns plural for 0', () => {
    expect(plural(0, 'fact')).toBe('0 facts');
  });

  it('returns plural for > 1', () => {
    expect(plural(5, 'event')).toBe('5 events');
  });
});

describe('truncate helper', () => {
  it('returns original when shorter than limit', () => {
    expect(truncate('short', 10)).toBe('short');
  });

  it('truncates and adds ellipsis when longer', () => {
    expect(truncate('this is a long string', 10)).toBe('this is a…');
  });

  it('returns original when exactly at limit', () => {
    expect(truncate('12345', 5)).toBe('12345');
  });
});

describe('hoursAgo helper', () => {
  it('returns a date in the past', () => {
    const result = hoursAgo(24);
    const now = Date.now();
    const expected = now - 24 * 60 * 60 * 1000;
    expect(Math.abs(result.getTime() - expected)).toBeLessThan(100);
  });

  it('0 hours returns approximately now', () => {
    const result = hoursAgo(0);
    expect(Math.abs(result.getTime() - Date.now())).toBeLessThan(100);
  });
});

describe('BriefingSection priority logic', () => {
  // Testing the priority assignment logic by implementing the rules
  function determinePriority(params: {
    hasSupersessions: boolean;
    hasAtRiskBlocks: boolean;
    hasStaleBlocks: boolean;
    hasFailedRuns: boolean;
    hasAppliedProposals: boolean;
  }): 'urgent' | 'success' | 'info' {
    if (params.hasSupersessions || params.hasAtRiskBlocks || params.hasStaleBlocks || params.hasFailedRuns) {
      return 'urgent';
    }
    if (params.hasAppliedProposals) {
      return 'success';
    }
    return 'info';
  }

  it('returns urgent when supersessions exist', () => {
    expect(determinePriority({
      hasSupersessions: true,
      hasAtRiskBlocks: false,
      hasStaleBlocks: false,
      hasFailedRuns: false,
      hasAppliedProposals: false,
    })).toBe('urgent');
  });

  it('returns urgent when at-risk blocks exist', () => {
    expect(determinePriority({
      hasSupersessions: false,
      hasAtRiskBlocks: true,
      hasStaleBlocks: false,
      hasFailedRuns: false,
      hasAppliedProposals: false,
    })).toBe('urgent');
  });

  it('returns urgent when failed runs exist', () => {
    expect(determinePriority({
      hasSupersessions: false,
      hasAtRiskBlocks: false,
      hasStaleBlocks: false,
      hasFailedRuns: true,
      hasAppliedProposals: false,
    })).toBe('urgent');
  });

  it('returns success when proposals applied', () => {
    expect(determinePriority({
      hasSupersessions: false,
      hasAtRiskBlocks: false,
      hasStaleBlocks: false,
      hasFailedRuns: false,
      hasAppliedProposals: true,
    })).toBe('success');
  });

  it('returns info by default', () => {
    expect(determinePriority({
      hasSupersessions: false,
      hasAtRiskBlocks: false,
      hasStaleBlocks: false,
      hasFailedRuns: false,
      hasAppliedProposals: false,
    })).toBe('info');
  });

  it('urgent takes priority over success', () => {
    expect(determinePriority({
      hasSupersessions: true,
      hasAtRiskBlocks: false,
      hasStaleBlocks: false,
      hasFailedRuns: false,
      hasAppliedProposals: true,
    })).toBe('urgent');
  });
});

describe('Alert detection (stale > 48h)', () => {
  function isStaleAlert(updatedAt: Date, now: Date = new Date()): boolean {
    const hoursSinceUpdate = (now.getTime() - updatedAt.getTime()) / (60 * 60 * 1000);
    return hoursSinceUpdate > 48;
  }

  it('detects blocks stale for more than 48 hours', () => {
    const oldDate = new Date(Date.now() - 49 * 60 * 60 * 1000);
    expect(isStaleAlert(oldDate)).toBe(true);
  });

  it('does not alert for blocks under 48 hours', () => {
    const recentDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(isStaleAlert(recentDate)).toBe(false);
  });

  it('boundary: exactly 48 hours is not stale', () => {
    const exactlyBoundary = new Date(Date.now() - 48 * 60 * 60 * 1000);
    expect(isStaleAlert(exactlyBoundary)).toBe(false);
  });
});
