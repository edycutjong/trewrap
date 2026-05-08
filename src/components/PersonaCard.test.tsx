import { render } from '@testing-library/react';
import { PersonaCard } from './PersonaCard';
import { describe, it, expect } from 'vitest';

describe('PersonaCard', () => {
  it('renders correctly', () => {
    const { container } = render(<PersonaCard />);
    expect(container).toBeTruthy();
  });
});
