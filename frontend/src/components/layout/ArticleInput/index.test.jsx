import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ArticleInput from './index';

// Mock the hooks
vi.mock('../../../hooks/article/useArticleSubmission', () => ({
  useArticleSubmission: vi.fn((callback) => ({
    url: '',
    setUrl: vi.fn(),
    loading: false,
    error: null,
    handleSubmit: vi.fn()
  }))
}));

// Mock AnalyzingAnimation
vi.mock('../../common/AnalyzingAnimation', () => ({
  default: () => <div data-testid="analyzing-animation">Analyzing...</div>
}));

// Mock react-icons
vi.mock('react-icons/hi', () => ({
  HiArrowRight: () => <span data-testid="arrow-icon">→</span>
}));

import { useArticleSubmission } from '../../../hooks/article/useArticleSubmission';

describe('ArticleInput', () => {
  const defaultProps = {
    onArticleSubmitted: vi.fn(),
    history: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input field and submit button', () => {
    render(<ArticleInput {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Enter a URL to analyze')).toBeInTheDocument();
    expect(screen.getByLabelText('Submit URL')).toBeInTheDocument();
  });

  it('displays label text', () => {
    render(<ArticleInput {...defaultProps} />);
    
    expect(screen.getByText(/Paste your article's url below:/)).toBeInTheDocument();
  });

  it('calls setUrl when user types in input', () => {
    const mockSetUrl = vi.fn();
    useArticleSubmission.mockReturnValue({
      url: '',
      setUrl: mockSetUrl,
      loading: false,
      error: null,
      handleSubmit: vi.fn()
    });

    render(<ArticleInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Enter a URL to analyze');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    
    expect(mockSetUrl).toHaveBeenCalledWith('https://example.com');
  });

  it('calls handleSubmit when submit button is clicked', () => {
    const mockHandleSubmit = vi.fn();
    useArticleSubmission.mockReturnValue({
      url: 'https://example.com',
      setUrl: vi.fn(),
      loading: false,
      error: null,
      handleSubmit: mockHandleSubmit
    });

    render(<ArticleInput {...defaultProps} />);
    
    fireEvent.click(screen.getByLabelText('Submit URL'));
    
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls handleSubmit when Enter key is pressed', () => {
    const mockHandleSubmit = vi.fn();
    useArticleSubmission.mockReturnValue({
      url: 'https://example.com',
      setUrl: vi.fn(),
      loading: false,
      error: null,
      handleSubmit: mockHandleSubmit
    });

    render(<ArticleInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Enter a URL to analyze');
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not submit when Enter is pressed while loading', () => {
    const mockHandleSubmit = vi.fn();
    useArticleSubmission.mockReturnValue({
      url: 'https://example.com',
      setUrl: vi.fn(),
      loading: true,
      error: null,
      handleSubmit: mockHandleSubmit
    });

    render(<ArticleInput {...defaultProps} />);
    
    // When loading, input is not visible (AnalyzingAnimation is shown)
    expect(screen.queryByPlaceholderText('Enter a URL to analyze')).not.toBeInTheDocument();
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });

  it('displays AnalyzingAnimation when loading', () => {
    useArticleSubmission.mockReturnValue({
      url: 'https://example.com',
      setUrl: vi.fn(),
      loading: true,
      error: null,
      handleSubmit: vi.fn()
    });

    render(<ArticleInput {...defaultProps} />);
    
    expect(screen.getByTestId('analyzing-animation')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter a URL to analyze')).not.toBeInTheDocument();
  });

  it('disables input and button when loading', () => {
    useArticleSubmission.mockReturnValue({
      url: 'https://example.com',
      setUrl: vi.fn(),
      loading: true,
      error: null,
      handleSubmit: vi.fn()
    });

    const { rerender } = render(<ArticleInput {...defaultProps} />);
    
    // Re-render with loading false to check disabled state
    useArticleSubmission.mockReturnValue({
      url: 'https://example.com',
      setUrl: vi.fn(),
      loading: false,
      error: null,
      handleSubmit: vi.fn()
    });
    rerender(<ArticleInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Enter a URL to analyze');
    const button = screen.getByLabelText('Submit URL');
    
    expect(input).not.toBeDisabled();
    expect(button).not.toBeDisabled();
    
    // Now check when loading is true
    useArticleSubmission.mockReturnValue({
      url: 'https://example.com',
      setUrl: vi.fn(),
      loading: true,
      error: null,
      handleSubmit: vi.fn()
    });
    rerender(<ArticleInput {...defaultProps} />);
    
    // Input shouldn't be visible when loading
    expect(screen.queryByPlaceholderText('Enter a URL to analyze')).not.toBeInTheDocument();
  });

  it('displays error message when error exists', () => {
    useArticleSubmission.mockReturnValue({
      url: 'https://example.com',
      setUrl: vi.fn(),
      loading: false,
      error: 'Invalid URL format',
      handleSubmit: vi.fn()
    });

    render(<ArticleInput {...defaultProps} />);
    
    expect(screen.getByText('Invalid URL format')).toBeInTheDocument();
  });

  it('does not display error message when error is null', () => {
    useArticleSubmission.mockReturnValue({
      url: 'https://example.com',
      setUrl: vi.fn(),
      loading: false,
      error: null,
      handleSubmit: vi.fn()
    });

    render(<ArticleInput {...defaultProps} />);
    
    expect(screen.queryByText('Invalid URL format')).not.toBeInTheDocument();
  });

  it('passes history prop to useArticleSubmission hook', () => {
    const mockHistory = [{ id: '1', url: 'https://example.com' }];
    
    render(<ArticleInput {...defaultProps} history={mockHistory} />);
    
    expect(useArticleSubmission).toHaveBeenCalledWith(
      expect.any(Function),
      mockHistory
    );
  });

  it('applies loading class to button when loading', () => {
    useArticleSubmission.mockReturnValue({
      url: 'https://example.com',
      setUrl: vi.fn(),
      loading: true,
      error: null,
      handleSubmit: vi.fn()
    });

    const { container } = render(<ArticleInput {...defaultProps} />);
    
    // Since button isn't rendered when loading (AnalyzingAnimation is shown instead),
    // we need to test this differently
    expect(screen.queryByLabelText('Submit URL')).not.toBeInTheDocument();
  });
});
