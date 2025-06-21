import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditPage from './EditPage';
import { usePresentations } from '@/contexts/PresentationsContext';

// Mock context
vi.mock('@/contexts/PresentationsContext');

// Mock child components
vi.mock('@/components/MarkdownEditor', () => ({
  default: vi.fn(({ markdown, onMarkdownChange }) => (
    <div data-testid="markdown-editor">
      <textarea value={markdown} onChange={(e) => onMarkdownChange(e.target.value)} />
    </div>
  )),
}));

vi.mock('@/components/VisualEditor', () => ({
  default: vi.fn(({ markdown, onMarkdownChange }) => (
    <div data-testid="visual-editor">
      <textarea value={markdown} onChange={(e) => onMarkdownChange(e.target.value)} />
    </div>
  )),
}));

// Mock Button component (already mocked in VisualEditor.test.tsx, but good to have here for clarity if run separately)
vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  )),
}));


describe('EditPage', () => {
  const mockGetCurrentSlideDeck = vi.fn();
  const mockUpdateSlideDeck = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test

    (usePresentations as vi.Mock).mockReturnValue({
      getCurrentSlideDeck: mockGetCurrentSlideDeck,
      updateSlideDeck: mockUpdateSlideDeck,
    });
  });

  it('renders MarkdownEditor by default when a deck is selected', () => {
    mockGetCurrentSlideDeck.mockReturnValue({ id: '1', name: 'Test Deck', content: 'Initial Markdown' });
    render(<EditPage />);
    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    expect(screen.queryByTestId('visual-editor')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Switch to Visual Editor/i })).toBeInTheDocument();
  });

  it('renders VisualEditor when toggled', () => {
    mockGetCurrentSlideDeck.mockReturnValue({ id: '1', name: 'Test Deck', content: 'Initial Markdown' });
    render(<EditPage />);

    const toggleButton = screen.getByRole('button', { name: /Switch to Visual Editor/i });
    fireEvent.click(toggleButton);

    expect(screen.getByTestId('visual-editor')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-editor')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Switch to Markdown Editor/i })).toBeInTheDocument();
  });

  it('toggles back to MarkdownEditor', () => {
    mockGetCurrentSlideDeck.mockReturnValue({ id: '1', name: 'Test Deck', content: 'Initial Markdown' });
    render(<EditPage />);

    const toggleButton = screen.getByRole('button', { name: /Switch to Visual Editor/i });
    fireEvent.click(toggleButton); // To Visual
    fireEvent.click(screen.getByRole('button', { name: /Switch to Markdown Editor/i })); // Back to Markdown

    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    expect(screen.queryByTestId('visual-editor')).not.toBeInTheDocument();
  });

  it('calls updateSlideDeck when MarkdownEditor content changes', () => {
    const initialContent = 'Initial Markdown';
    const newContent = 'Updated Markdown from MarkdownEditor';
    mockGetCurrentSlideDeck.mockReturnValue({ id: 'deck1', name: 'Test Deck', content: initialContent });
    render(<EditPage />);

    const markdownEditorTextarea = screen.getByTestId('markdown-editor').querySelector('textarea');
    expect(markdownEditorTextarea).toBeInTheDocument();
    fireEvent.change(markdownEditorTextarea!, { target: { value: newContent } });

    expect(mockUpdateSlideDeck).toHaveBeenCalledTimes(1);
    expect(mockUpdateSlideDeck).toHaveBeenCalledWith('deck1', { content: newContent });
  });

  it('calls updateSlideDeck when VisualEditor content changes', () => {
    const initialContent = 'Initial Markdown';
    const newContent = 'Updated Markdown from VisualEditor';
    mockGetCurrentSlideDeck.mockReturnValue({ id: 'deck1', name: 'Test Deck', content: initialContent });
    render(<EditPage />);

    // Switch to Visual Editor
    const toggleButton = screen.getByRole('button', { name: /Switch to Visual Editor/i });
    fireEvent.click(toggleButton);

    const visualEditorTextarea = screen.getByTestId('visual-editor').querySelector('textarea');
    expect(visualEditorTextarea).toBeInTheDocument();
    fireEvent.change(visualEditorTextarea!, { target: { value: newContent } });

    expect(mockUpdateSlideDeck).toHaveBeenCalledTimes(1);
    expect(mockUpdateSlideDeck).toHaveBeenCalledWith('deck1', { content: newContent });
  });

  it('renders "No Slide Deck Selected" message if no current deck', () => {
    mockGetCurrentSlideDeck.mockReturnValue(null);
    render(<EditPage />);
    expect(screen.getByText('No Slide Deck Selected')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-editor')).not.toBeInTheDocument();
    expect(screen.queryByTestId('visual-editor')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument(); // No toggle button
  });
});
