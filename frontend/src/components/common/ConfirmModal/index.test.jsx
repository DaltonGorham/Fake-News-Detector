import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from './index';

describe('ConfirmModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ConfirmModal 
        isOpen={false}
        title="Test"
        message="Test message"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when isOpen is true', () => {
    render(
      <ConfirmModal 
        isOpen={true}
        title="Delete Item"
        message="Are you sure you want to delete this?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this?')).toBeInTheDocument();
  });

  it('renders default button texts when not provided', () => {
    render(
      <ConfirmModal 
        isOpen={true}
        title="Test"
        message="Test message"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders custom button texts when provided', () => {
    render(
      <ConfirmModal 
        isOpen={true}
        title="Test"
        message="Test message"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        confirmText="Yes, delete"
        cancelText="No, keep it"
      />
    );
    
    expect(screen.getByText('Yes, delete')).toBeInTheDocument();
    expect(screen.getByText('No, keep it')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const mockConfirm = vi.fn();
    
    render(
      <ConfirmModal 
        isOpen={true}
        title="Test"
        message="Test message"
        onConfirm={mockConfirm}
        onCancel={vi.fn()}
      />
    );
    
    fireEvent.click(screen.getByText('Confirm'));
    expect(mockConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    const mockCancel = vi.fn();
    
    render(
      <ConfirmModal 
        isOpen={true}
        title="Test"
        message="Test message"
        onConfirm={vi.fn()}
        onCancel={mockCancel}
      />
    );
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when backdrop is clicked', () => {
    const mockCancel = vi.fn();
    
    render(
      <ConfirmModal 
        isOpen={true}
        title="Test"
        message="Test message"
        onConfirm={vi.fn()}
        onCancel={mockCancel}
      />
    );
    
    const backdrop = screen.getByText('Test').parentElement.parentElement;
    fireEvent.click(backdrop);
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('does not call onCancel when modal content is clicked', () => {
    const mockCancel = vi.fn();
    
    render(
      <ConfirmModal 
        isOpen={true}
        title="Test"
        message="Test message"
        onConfirm={vi.fn()}
        onCancel={mockCancel}
      />
    );
    
    const modalContent = screen.getByText('Test').parentElement;
    fireEvent.click(modalContent);
    expect(mockCancel).not.toHaveBeenCalled();
  });

  it('applies dangerous class to confirm button when isDangerous is true', () => {
    render(
      <ConfirmModal 
        isOpen={true}
        title="Test"
        message="Test message"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isDangerous={true}
      />
    );
    
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toHaveClass('dangerous');
  });

  it('does not apply dangerous class when isDangerous is false', () => {
    render(
      <ConfirmModal 
        isOpen={true}
        title="Test"
        message="Test message"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isDangerous={false}
      />
    );
    
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).not.toHaveClass('dangerous');
  });
});
