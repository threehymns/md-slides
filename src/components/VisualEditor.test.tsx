import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VisualEditor from './VisualEditor';
import { Reorder } from 'framer-motion';

// Mock framer-motion's Reorder components
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    Reorder: {
      Group: vi.fn(({ children }) => <div>{children}</div>),
      Item: vi.fn(({ children, value }) => <div data-testid={`reorder-item-${value}`}>{children}</div>),
    },
  };
});

// Mock Button component
vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, onClick, variant, size }) => (
    <button onClick={onClick} data-variant={variant} data-size={size}>
      {children}
    </button>
  )),
}));

const DEFAULT_NEW_SLIDE_CONTENT = "# New Slide\n\nEdit this content.";

describe('VisualEditor', () => {
  let onMarkdownChangeMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onMarkdownChangeMock = vi.fn();
    // Mock window.confirm
    global.window.confirm = vi.fn(() => true);
  });

  const initialMarkdown = "Slide 1\n---\nSlide 2\n---\nSlide 3";
  const initialSlides = initialMarkdown.split('\n---\n');

  it('renders the correct number of slide sections', () => {
    render(<VisualEditor markdown={initialMarkdown} onMarkdownChange={onMarkdownChangeMock} />);
    const textareas = screen.getAllByRole('textbox');
    expect(textareas.length).toBe(initialSlides.length);
    initialSlides.forEach((slideContent, index) => {
      expect(textareas[index]).toHaveValue(slideContent);
    });
  });

  it('handles text editing and calls onMarkdownChange', () => {
    render(<VisualEditor markdown={initialMarkdown} onMarkdownChange={onMarkdownChangeMock} />);
    const textareas = screen.getAllByRole('textbox');
    const firstTextarea = textareas[0];
    const newText = "Updated Slide 1 Content";
    fireEvent.change(firstTextarea, { target: { value: newText } });

    expect(onMarkdownChangeMock).toHaveBeenCalledTimes(1);
    const expectedMarkdown = [newText, ...initialSlides.slice(1)].join('\n---\n');
    expect(onMarkdownChangeMock).toHaveBeenCalledWith(expectedMarkdown);
  });

  it('adds a new slide and calls onMarkdownChange', () => {
    render(<VisualEditor markdown={initialMarkdown} onMarkdownChange={onMarkdownChangeMock} />);
    // Assuming "Add New Slide Here" buttons are identifiable.
    // The mock button will render its children as text content.
    const addButtons = screen.getAllByText('Add New Slide Here');
    fireEvent.click(addButtons[0]); // Click "Add New Slide Here" for the first slide

    expect(onMarkdownChangeMock).toHaveBeenCalledTimes(1);
    const expectedSlides = [
      initialSlides[0],
      DEFAULT_NEW_SLIDE_CONTENT,
      ...initialSlides.slice(1),
    ];
    expect(onMarkdownChangeMock).toHaveBeenCalledWith(expectedSlides.join('\n---\n'));
  });

  it('deletes a slide and calls onMarkdownChange', () => {
    render(<VisualEditor markdown={initialMarkdown} onMarkdownChange={onMarkdownChangeMock} />);
    const deleteButtons = screen.getAllByText('Delete This Slide');
    fireEvent.click(deleteButtons[0]); // Click "Delete This Slide" for the first slide

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(onMarkdownChangeMock).toHaveBeenCalledTimes(1);
    const expectedSlides = initialSlides.slice(1);
    expect(onMarkdownChangeMock).toHaveBeenCalledWith(expectedSlides.join('\n---\n'));
  });

  it('deletes the last slide and calls onMarkdownChange with empty string if confirmed', () => {
    render(<VisualEditor markdown="Only one slide" onMarkdownChange={onMarkdownChangeMock} />);
    const deleteButton = screen.getByText('Delete This Slide');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(onMarkdownChangeMock).toHaveBeenCalledTimes(1);
    expect(onMarkdownChangeMock).toHaveBeenCalledWith("");
  });

   it('initializes with a default slide if markdown is empty', () => {
    render(<VisualEditor markdown="" onMarkdownChange={onMarkdownChangeMock} />);
    const textareas = screen.getAllByRole('textbox');
    expect(textareas.length).toBe(1);
    expect(textareas[0]).toHaveValue(DEFAULT_NEW_SLIDE_CONTENT);
  });

  it('handles reordering (via direct Reorder.Group prop call)', () => {
    // For this test, we need to get the instance or a way to call the onReorder prop
    // Since Reorder.Group is mocked, we can check if its mock was called with the right props
    // or simulate the reorder by directly manipulating state if the component structure allowed.
    // However, the current mock is a simple pass-through for children.
    // A more direct way is to test the 'handleReorder' function if it were exported,
    // or to trigger the onReorder prop of the mocked Reorder.Group.

    // Let's assume we can get the onReorder prop from the mocked Reorder.Group
    // This requires the mock to capture the props.
    const MockedReorderGroup = Reorder.Group as ReturnType<typeof vi.fn>;
    render(<VisualEditor markdown={initialMarkdown} onMarkdownChange={onMarkdownChangeMock} />);

    // The mock needs to be structured to capture its props, e.g., by assigning props to an external var
    // or by implementing the mock to call a passed-in function.
    // For simplicity, let's assume the onReorder function is called by the component.
    // We will retrieve the Reorder.Group's props.
    // The mock for Reorder.Group is: vi.fn(({ children }) => <div>{children}</div>)
    // To get onReorder, the mock would need to be:
    // Reorder.Group: vi.fn(props => <div {...props}>{props.children}</div>),
    // Or, more simply, we find the Reorder.Group instance and trigger its onReorder.
    // Since direct simulation of drag-and-drop is complex, we'll simulate the callback.

    // To effectively test onReorder, the mock needs to expose the onReorder prop.
    // Let's refine the Reorder.Group mock for this test:
    let capturedOnReorder: ((newOrder: string[]) => void) | undefined;
    vi.mocked(Reorder.Group).mockImplementationOnce((props: any) => {
      capturedOnReorder = props.onReorder;
      return <div>{props.children}</div>;
    });

    render(<VisualEditor markdown={initialMarkdown} onMarkdownChange={onMarkdownChangeMock} />);

    if (!capturedOnReorder) {
      throw new Error("onReorder prop was not captured by the mock");
    }

    const reorderedSlides = [initialSlides[1], initialSlides[0], initialSlides[2]];
    act(() => {
      capturedOnReorder(reorderedSlides);
    });

    expect(onMarkdownChangeMock).toHaveBeenCalledTimes(1);
    expect(onMarkdownChangeMock).toHaveBeenCalledWith(reorderedSlides.join('\n---\n'));
  });
});
