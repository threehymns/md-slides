import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VisualEditor from './VisualEditor';
import { Reorder } from 'framer-motion';

interface SlideItem {
  id: string;
  content: string;
}

// Mock framer-motion's Reorder components
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    Reorder: {
      // Ensure the mock for Group captures the onReorder prop
      Group: vi.fn((props: { children: React.ReactNode; onReorder: (newOrder: SlideItem[]) => void }) => (
        <div data-testid="reorder-group" data-onreorder={props.onReorder}>
          {props.children}
        </div>
      )),
      Item: vi.fn(({ children, value }: { children: React.ReactNode; value: SlideItem }) => (
        <div data-testid={`reorder-item-${value.id}`}>
          {children}
        </div>
      )),
    },
  };
});

// Mock Button component
vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, onClick, variant, size }) => (
    <button onClick={onClick} data-variant={variant} data-size={size} data-testid={children?.toString().toLowerCase().replace(/\s+/g, '-')}>
      {children}
    </button>
  )),
}));

const DEFAULT_NEW_SLIDE_CONTENT = "# New Slide\n\nEdit this content.";

// Helper to get the current slide items from the rendered textareas
const getRenderedSlideItems = (): SlideItem[] => {
  const textareas = screen.queryAllByRole('textbox');
  // The Reorder.Item mock uses data-testid like `reorder-item-${value.id}`
  // We need a way to get the ID from the rendered item if textareas are not sufficient
  // For now, we'll assume textareas map to slides and generate mock IDs for comparison if needed
  // or rely on the order and content.
  // A better approach for tests involving ID would be to ensure IDs are somehow queryable or passed to textareas.
  // Let's assume the test will mostly verify the onMarkdownChange content.
  return textareas.map((ta, index) => ({
    id: `mock-id-${index}`, // This ID is just for local test structure, not what component uses
    content: (ta as HTMLTextAreaElement).value,
  }));
};


describe('VisualEditor', () => {
  let onMarkdownChangeMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetAllMocks(); // Reset mocks for each test
    onMarkdownChangeMock = vi.fn();
    global.window.confirm = vi.fn(() => true);

    // Reset Reorder.Group mock for each test to allow capturing onReorder
    vi.mocked(Reorder.Group).mockImplementation((props: any) => {
        // Store the onReorder callback so it can be called directly in tests
        (Reorder.Group as any).capturedOnReorder = props.onReorder;
        return <div data-testid="reorder-group">{props.children}</div>;
      });
  });

  const initialMarkdown = "Slide 1\n---\nSlide 2\n---\nSlide 3";
  const initialSlideContents = initialMarkdown.split('\n---\n');

  it('renders the correct number of slide sections from initial markdown', () => {
    render(<VisualEditor markdown={initialMarkdown} onMarkdownChange={onMarkdownChangeMock} />);
    const textareas = screen.getAllByRole('textbox');
    expect(textareas.length).toBe(initialSlideContents.length);
    initialSlideContents.forEach((slideContent, index) => {
      expect(textareas[index]).toHaveValue(slideContent);
    });
  });

  it('handles text editing and calls onMarkdownChange with updated content', () => {
    render(<VisualEditor markdown={initialMarkdown} onMarkdownChange={onMarkdownChangeMock} />);
    // Wait for the component to stabilize after useEffect
    // In VisualEditor, useEffect splits markdown and sets slideItems.
    // We need to ensure this has completed before interacting.
    // A short delay or waiting for an element can help.
    // For simplicity, we assume it's quick enough or rely on test timing.

    const textareas = screen.getAllByRole('textbox');
    const firstTextarea = textareas[0];
    const newText = "Updated Slide 1 Content";

    act(() => {
        fireEvent.change(firstTextarea, { target: { value: newText } });
    });

    expect(onMarkdownChangeMock).toHaveBeenCalledTimes(1);
    const expectedMarkdown = [newText, ...initialSlideContents.slice(1)].join('\n---\n');
    expect(onMarkdownChangeMock).toHaveBeenCalledWith(expectedMarkdown);
  });

  it('adds a new slide after a specific slide and calls onMarkdownChange', () => {
    render(<VisualEditor markdown={initialMarkdown} onMarkdownChange={onMarkdownChangeMock} />);
    // Add button is identified by its text content.
    const addButtons = screen.getAllByTestId('add-new-slide-here');
    act(() => {
        fireEvent.click(addButtons[0]); // Click "Add New Slide Here" for the first slide
    });

    expect(onMarkdownChangeMock).toHaveBeenCalledTimes(1);
    const expectedContents = [
      initialSlideContents[0],
      DEFAULT_NEW_SLIDE_CONTENT,
      ...initialSlideContents.slice(1),
    ];
    expect(onMarkdownChangeMock).toHaveBeenCalledWith(expectedContents.join('\n---\n'));
  });

  it('deletes a specific slide and calls onMarkdownChange', () => {
    render(<VisualEditor markdown={initialMarkdown} onMarkdownChange={onMarkdownChangeMock} />);
    const deleteButtons = screen.getAllByTestId('delete-this-slide');
    act(() => {
        fireEvent.click(deleteButtons[0]); // Click "Delete This Slide" for the first slide
    });

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(onMarkdownChangeMock).toHaveBeenCalledTimes(1);
    const expectedContents = initialSlideContents.slice(1);
    expect(onMarkdownChangeMock).toHaveBeenCalledWith(expectedContents.join('\n---\n'));
  });

  it('deletes the last slide and replaces it with a default slide', () => {
    render(<VisualEditor markdown="Only one slide" onMarkdownChange={onMarkdownChangeMock} />);
    const deleteButton = screen.getByTestId('delete-this-slide');
    act(() => {
        fireEvent.click(deleteButton);
    });

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(onMarkdownChangeMock).toHaveBeenCalledTimes(1);
    // Behavior changed: now it replaces with a default slide
    expect(onMarkdownChangeMock).toHaveBeenCalledWith(DEFAULT_NEW_SLIDE_CONTENT);
  });

   it('initializes with a default slide if markdown is empty', () => {
    render(<VisualEditor markdown="" onMarkdownChange={onMarkdownChangeMock} />);
    const textareas = screen.getAllByRole('textbox');
    expect(textareas.length).toBe(1);
    expect(textareas[0]).toHaveValue(DEFAULT_NEW_SLIDE_CONTENT);
  });

  it('handles reordering and calls onMarkdownChange with reordered content', () => {
    // Render the component. The mock for Reorder.Group will capture the onReorder prop.
    render(<VisualEditor markdown={initialMarkdown} onMarkdownChange={onMarkdownChangeMock} />);

    // The initial state in the component will be an array of SlideItem objects.
    // We need to simulate onReorder with a new array of these objects.
    // Let's assume the initial items are [{id: 'id1', content: 'Slide 1'}, {id: 'id2', content: 'Slide 2'}, {id: 'id3', content: 'Slide 3'}]
    // We need to know the actual IDs or make the test less dependent on them if they are randomly generated.
    // The component internally generates IDs. For testing reorder, we can grab the current state
    // (if possible, though not directly from outside) or assume a structure.

    // Since IDs are generated internally, we can't easily predict them.
    // However, the onReorder prop is called with the *current* items in their new order.
    // Let's get the current items based on rendered textareas to construct our reordered array.
    const initialItemsForTest: SlideItem[] = initialSlideContents.map((content, i) => ({
        id: `test-id-${i}`, // These IDs are for test setup only
        content: content,
    }));

    // Simulate the reorder operation by calling the captured onReorder
    const capturedOnReorder = (Reorder.Group as any).capturedOnReorder as (newOrder: SlideItem[]) => void;
    if (!capturedOnReorder) {
      throw new Error("onReorder prop was not captured by the Reorder.Group mock");
    }

    // Create a reordered list of SlideItem objects.
    // For this to work, the items passed to capturedOnReorder must be the *actual items* from the component's state.
    // The test currently passes `initialItemsForTest` which might not have the same IDs as internal state.
    // This test needs a way to access the current slideItems from the component or a more sophisticated mock.

    // Let's simplify: the component's `useEffect` creates SlideItems. We test that if `onReorder` is called with
    // a new order of *some* SlideItems, `onMarkdownChange` reflects their content.
    const itemsForReorder: SlideItem[] = [
        { id: 'id1', content: initialSlideContents[0] },
        { id: 'id2', content: initialSlideContents[1] },
        { id: 'id3', content: initialSlideContents[2] },
    ];
    const reorderedItems: SlideItem[] = [itemsForReorder[1], itemsForReorder[0], itemsForReorder[2]];

    act(() => {
      capturedOnReorder(reorderedItems);
    });

    expect(onMarkdownChangeMock).toHaveBeenCalledTimes(1);
    const expectedMarkdown = [itemsForReorder[1].content, itemsForReorder[0].content, itemsForReorder[2].content].join('\n---\n');
    expect(onMarkdownChangeMock).toHaveBeenCalledWith(expectedMarkdown);
  });
});
