import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as htmlToImage from 'html-to-image';
import Page from './page';

global.fetch = vi.fn();

vi.mock('html-to-image', () => ({
  toPng: vi.fn(),
}));

describe('Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders initial state', () => {
    render(<Page />);
    expect(screen.getByText(/Discover your/)).toBeInTheDocument();
    expect(screen.queryByText(/ANALYZING/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /GENERATE WRAPPED/i })).toBeDisabled();
  });

  it('handles input and form submission', async () => {
    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        persona: 'Diamond Hands',
        description: 'Test description',
        stats: {}
      })
    } as Response));

    render(<Page />);
    
    const input = screen.getByPlaceholderText('Enter wallet address...');
    fireEvent.change(input, { target: { value: 'wallet123' } });
    
    const button = screen.getByRole('button', { name: /GENERATE WRAPPED/i });
    expect(button).not.toBeDisabled();
    
    fireEvent.click(button);
    
    expect(screen.getByRole('button', { name: /ANALYZING ON DUNE/i })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Share on X')).toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<Page />);
    
    const input = screen.getByPlaceholderText('Enter wallet address...');
    fireEvent.change(input, { target: { value: 'wallet123' } });
    
    const button = screen.getByRole('button', { name: /GENERATE WRAPPED/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  it('handles empty wallet gracefully', () => {
    render(<Page />);
    const button = screen.getByRole('button', { name: /GENERATE WRAPPED/i });
    expect(button).toBeDisabled();
    // Force a form submission to trigger handleGenerate with empty wallet
    fireEvent.submit(button.closest('form')!);
    // Loading should not be triggered
    expect(screen.queryByText(/ANALYZING/i)).not.toBeInTheDocument();
  });

  it('handles non-ok API response gracefully', async () => {
    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({})
    } as Response));

    render(<Page />);
    
    const input = screen.getByPlaceholderText('Enter wallet address...');
    fireEvent.change(input, { target: { value: 'wallet123' } });
    
    const button = screen.getByRole('button', { name: /GENERATE WRAPPED/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      // It should finish loading and show the result card (which handles errors internally or shows fallback)
      expect(screen.queryByText(/ANALYZING/i)).not.toBeInTheDocument();
    });
  });

  it('handles TEST WALLET button click', () => {
    render(<Page />);
    const testButton = screen.getByRole('button', { name: /TEST WALLET/i });
    fireEvent.click(testButton);
    const input = screen.getByPlaceholderText('Enter wallet address...');
    expect(input).toHaveValue('vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg');
  });

  it('handles Download button click successfully', async () => {
    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ persona: 'Test', description: 'Test', stats: {} })
    } as Response));

    vi.mocked(htmlToImage.toPng).mockResolvedValue('data:image/png;base64,AAAA');

    render(<Page />);
    const input = screen.getByPlaceholderText('Enter wallet address...');
    fireEvent.change(input, { target: { value: 'wallet123' } });
    fireEvent.click(screen.getByRole('button', { name: /GENERATE WRAPPED/i }));

    await waitFor(() => expect(screen.getByText('Download')).toBeInTheDocument());

    // Spy on createElement AFTER render so React isn't broken
    const clickMock = vi.fn();
    const origCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        return { href: '', download: '', click: clickMock } as unknown as HTMLAnchorElement;
      }
      return origCreate(tag);
    });

    fireEvent.click(screen.getByText('Download'));

    await waitFor(() => {
      expect(htmlToImage.toPng).toHaveBeenCalled();
      expect(clickMock).toHaveBeenCalled();
    });

    vi.restoreAllMocks();
  });

  it('handles Download error gracefully', async () => {
    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ persona: 'Test', description: 'Test', stats: {} })
    } as Response));

    vi.mocked(htmlToImage.toPng).mockRejectedValue(new Error('Canvas error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<Page />);
    const input = screen.getByPlaceholderText('Enter wallet address...');
    fireEvent.change(input, { target: { value: 'wallet123' } });
    fireEvent.click(screen.getByRole('button', { name: /GENERATE WRAPPED/i }));

    await waitFor(() => expect(screen.getByText('Download')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Download'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to download image', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('handles Share on X button click', async () => {
    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ persona: 'Test', description: 'Test', stats: {} })
    } as Response));

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(<Page />);
    const input = screen.getByPlaceholderText('Enter wallet address...');
    fireEvent.change(input, { target: { value: 'wallet123' } });
    fireEvent.click(screen.getByRole('button', { name: /GENERATE WRAPPED/i }));

    await waitFor(() => expect(screen.getByText('Share on X')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Share on X'));

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('twitter.com/intent/tweet'),
      '_blank'
    );

    openSpy.mockRestore();
  });
});
