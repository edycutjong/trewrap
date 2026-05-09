import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RootLayout from './layout';

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: 'mock-inter' }),
  JetBrains_Mono: () => ({ variable: 'mock-mono' })
}));

describe('RootLayout', () => {
  it('renders children', () => {
    const originalError = console.error;
    const consoleError = vi.spyOn(console, 'error').mockImplementation((msg, ...args) => {
      if (typeof msg === 'string' && msg.includes('cannot be a child of')) return;
      originalError(msg, ...args);
    });

    render(
      <RootLayout>
        <div data-testid="child-element">Child</div>
      </RootLayout>
    );
    expect(screen.getByTestId('child-element')).toBeInTheDocument();

    consoleError.mockRestore();
  });
});
