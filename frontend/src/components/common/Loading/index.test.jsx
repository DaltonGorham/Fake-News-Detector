import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from './index';

describe('Loading', () => {
  it('renders loading spinner and text', () => {
    render(<Loading />);
    
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByText('Loading').closest('.loading-container')).toBeInTheDocument();
  });

  it('renders with default container class when inline is false', () => {
    const { container } = render(<Loading />);
    
    expect(container.querySelector('.loading-container')).toBeInTheDocument();
    expect(container.querySelector('.loading-container-inline')).not.toBeInTheDocument();
  });

  it('renders with inline container class when inline is true', () => {
    const { container } = render(<Loading inline={true} />);
    
    expect(container.querySelector('.loading-container-inline')).toBeInTheDocument();
    expect(container.querySelector('.loading-container')).not.toBeInTheDocument();
  });

  it('renders spinner element', () => {
    const { container } = render(<Loading />);
    
    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('renders loading text', () => {
    const { container } = render(<Loading />);
    
    expect(container.querySelector('.loading-text')).toBeInTheDocument();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});
