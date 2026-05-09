import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AboutPage from './page';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a>
}));

describe('AboutPage', () => {
  it('renders the about page', () => {
    render(<AboutPage />);
    expect(screen.getByText('Trewrap')).toBeInTheDocument();
    expect(screen.getByText('Treasury Analytics')).toBeInTheDocument();
    expect(screen.getByText('WHAT IT DOES')).toBeInTheDocument();
    expect(screen.getByText('TECH STACK')).toBeInTheDocument();
    expect(screen.getByText('HACKATHON')).toBeInTheDocument();
  });
});
