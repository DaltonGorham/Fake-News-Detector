import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ArticleDetails from './index';

// Mock the article API
vi.mock('../../../api/articles', () => ({
  articleApi: {
    getAnalysis: vi.fn()
  }
}));

// Mock Loading component
vi.mock('../../common/Loading', () => ({
  default: ({ inline }) => <div data-testid="loading">Loading{inline ? ' inline' : ''}</div>
}));

// Mock TruthnessGauge
vi.mock('../../common/TruthnessGauge', () => ({
  default: ({ score, label }) => (
    <div data-testid="truthness-gauge">
      Score: {score}, Label: {label}
    </div>
  )
}));

// Mock cacheManager
vi.mock('../../../util/cacheManager', () => ({
  createCache: vi.fn(() => ({})),
  cachedFetch: vi.fn((cache, fetchFn, callbacks) => {
    return fetchFn().then(data => {
      callbacks.onSuccess(data);
      return data;
    }).catch(err => {
      callbacks.onError(err);
      throw err;
    });
  })
}));

// Mock react-icons
vi.mock('react-icons/hi', () => ({
  HiX: () => <span>X</span>,
  HiExternalLink: () => <span>Link</span>,
  HiCalendar: () => <span>Calendar</span>,
  HiNewspaper: () => <span>News</span>
}));

import { articleApi } from '../../../api/articles';

describe('ArticleDetails', () => {
  const mockArticleData = {
    id: '123',
    title: 'Test Article',
    url: 'https://example.com/article',
    source: 'Example News',
    collected_date: '2024-01-15T10:00:00Z',
    ai_result: [{
      truthness_score: 0.85,
      truthness_label: 'Reliable',
      genre: 'Politics',
      is_satire: false,
      related_articles: [
        { title: 'Related Article 1', url: 'https://example.com/related1' }
      ]
    }]
  };

  const defaultProps = {
    articleId: '123',
    isOpen: true,
    onClose: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    articleApi.getAnalysis.mockResolvedValue({ data: mockArticleData });
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ArticleDetails {...defaultProps} isOpen={false} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('fetches and displays article details when opened', async () => {
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });
    
    expect(articleApi.getAnalysis).toHaveBeenCalledWith('123');
  });

  it('displays loading state while fetching', async () => {
    articleApi.getAnalysis.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: mockArticleData }), 100))
    );

    render(<ArticleDetails {...defaultProps} />);
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });
  });

  it('displays close button', () => {
    render(<ArticleDetails {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close article details');
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const mockOnClose = vi.fn();
    
    render(<ArticleDetails {...defaultProps} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByLabelText('Close article details'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', async () => {
    const mockOnClose = vi.fn();
    
    render(<ArticleDetails {...defaultProps} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });
    
    const overlay = screen.getByText('Test Article').closest('.article-details-overlay');
    fireEvent.click(overlay);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when modal content is clicked', async () => {
    const mockOnClose = vi.fn();
    
    render(<ArticleDetails {...defaultProps} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });
    
    const modal = screen.getByText('Test Article').closest('.article-details-modal');
    fireEvent.click(modal);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('displays TruthnessGauge with correct score', async () => {
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('truthness-gauge')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Score: 85/)).toBeInTheDocument();
  });

  it('displays confidence message based on score', async () => {
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText(/very likely real/)).toBeInTheDocument();
    });
  });

  it('displays article URL as a link', async () => {
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      const link = screen.getByText('https://example.com/article');
      expect(link.closest('a')).toHaveAttribute('href', 'https://example.com/article');
      expect(link.closest('a')).toHaveAttribute('target', '_blank');
    });
  });

  it('displays article source', async () => {
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Example News')).toBeInTheDocument();
    });
  });

  it('displays formatted collection date', async () => {
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
    });
  });

  it('displays article category', async () => {
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Politics')).toBeInTheDocument();
    });
  });

  it('displays related articles', async () => {
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Related Articles')).toBeInTheDocument();
      expect(screen.getByText('Related Article 1')).toBeInTheDocument();
    });
  });

  it('displays satire warning when is_satire is true', async () => {
    const satiricalArticle = {
      ...mockArticleData,
      ai_result: [{
        ...mockArticleData.ai_result[0],
        is_satire: true
      }]
    };
    
    articleApi.getAnalysis.mockResolvedValue({ data: satiricalArticle });
    
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Satirical Content Detected/)).toBeInTheDocument();
    });
  });

  it('displays AI disclaimer', async () => {
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText(/AI Analysis Disclaimer:/)).toBeInTheDocument();
    });
  });

  it('displays error state when fetch fails', async () => {
    articleApi.getAnalysis.mockResolvedValue({ 
      error: 'Failed to fetch article' 
    });
    
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load article details')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch article')).toBeInTheDocument();
    });
  });

  it('displays retry button on error', async () => {
    articleApi.getAnalysis.mockResolvedValue({ 
      error: 'Network error' 
    });
    
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('retries fetch when retry button is clicked', async () => {
    articleApi.getAnalysis
      .mockResolvedValueOnce({ error: 'Network error' })
      .mockResolvedValueOnce({ data: mockArticleData });
    
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Try Again'));
    
    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });
    
    expect(articleApi.getAnalysis).toHaveBeenCalledTimes(2);
  });

  it('displays empty state when no article data', async () => {
    articleApi.getAnalysis.mockResolvedValue({ data: null });
    
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('No article data available')).toBeInTheDocument();
    });
  });

  it('handles article with no title', async () => {
    const articleWithoutTitle = { ...mockArticleData, title: null };
    articleApi.getAnalysis.mockResolvedValue({ data: articleWithoutTitle });
    
    render(<ArticleDetails {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Untitled Article')).toBeInTheDocument();
    });
  });

  it('does not fetch when articleId is not provided', () => {
    render(<ArticleDetails {...defaultProps} articleId={null} />);
    
    expect(articleApi.getAnalysis).not.toHaveBeenCalled();
  });
});
