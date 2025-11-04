import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import TruthnessGauge from './index';

// Mock the GaugeComponent since it's a third-party library
vi.mock('react-gauge-component', () => ({
  default: ({ value }) => <div data-testid="gauge-component" data-value={value} />
}));

describe('TruthnessGauge', () => {
  it('renders with score and label', () => {
    render(<TruthnessGauge score={75} label="Reliable" />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Reliable')).toBeInTheDocument();
  });

  it('displays UNKNOWN when no label is provided', () => {
    render(<TruthnessGauge score={50} />);
    
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });

  it('handles zero score', () => {
    render(<TruthnessGauge score={0} label="Unreliable" />);
    
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('Unreliable')).toBeInTheDocument();
  });

  it('handles 100% score', () => {
    render(<TruthnessGauge score={100} label="Very Reliable" />);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('rounds score to nearest integer', () => {
    render(<TruthnessGauge score={75.7} label="Test" />);
    
    expect(screen.getByText('76%')).toBeInTheDocument();
  });

  it('animates gauge value after delay', async () => {
    render(<TruthnessGauge score={80} label="Test" />);
    
    const gauge = screen.getByTestId('gauge-component');
    
    // Initially should be 0
    expect(gauge).toHaveAttribute('data-value', '0');
    
    // After 200ms animation, should be 80
    await waitFor(() => {
      expect(gauge).toHaveAttribute('data-value', '80');
    }, { timeout: 300 });
  });

  it('handles undefined score gracefully', () => {
    render(<TruthnessGauge label="Test" />);
    
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
