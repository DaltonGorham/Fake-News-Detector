import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AiDisclaimer from './index';

describe('AiDisclaimer', () => {
  it('does not show modal initially', () => {
    render(<AiDisclaimer />);
    expect(screen.queryByText('About This Tool')).not.toBeInTheDocument();
  });

  it('opens modal when help button is clicked', () => {
    render(<AiDisclaimer />);
    const button = screen.getByLabelText('Open AI Disclaimer');
    
    fireEvent.click(button);
    
    expect(screen.getByText('About This Tool')).toBeInTheDocument();
  });

  it('closes modal when X button is clicked', () => {
    render(<AiDisclaimer />);
    fireEvent.click(screen.getByLabelText('Open AI Disclaimer'));
    
    expect(screen.getByText('About This Tool')).toBeInTheDocument();
    
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    expect(screen.queryByText('About This Tool')).not.toBeInTheDocument();
  });

  it('closes modal when "Got It" button is clicked', () => {
    render(<AiDisclaimer />);
    fireEvent.click(screen.getByLabelText('Open AI Disclaimer'));
    
    const gotItButton = screen.getByText('Got It');
    fireEvent.click(gotItButton);
    
    expect(screen.queryByText('About This Tool')).not.toBeInTheDocument();
  });

  it('closes modal when backdrop is clicked', () => {
    render(<AiDisclaimer />);
    fireEvent.click(screen.getByLabelText('Open AI Disclaimer'));
    
    const backdrop = screen.getByText('About This Tool').closest('.ai-disclaimer-modal');
    fireEvent.click(backdrop);
    
    expect(screen.queryByText('About This Tool')).not.toBeInTheDocument();
  });

  it('does not close modal when content is clicked', () => {
    render(<AiDisclaimer />);
    fireEvent.click(screen.getByLabelText('Open AI Disclaimer'));
    
    const content = screen.getByText('About This Tool').closest('.ai-disclaimer-content');
    fireEvent.click(content);
    
    expect(screen.getByText('About This Tool')).toBeInTheDocument();
  });
});
