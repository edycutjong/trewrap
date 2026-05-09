import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

vi.mock('next/font/google', () => ({
  Inter: () => ({
    style: { fontFamily: 'inter' },
    className: 'inter',
    variable: '--font-inter',
  }),
}));
