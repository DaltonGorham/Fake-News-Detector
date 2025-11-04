import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserAvatar from './index';

describe('UserAvatar', () => {
  it('renders avatar image when avatar_url is provided', () => {
    const profile = {
      username: 'testuser',
      avatar_url: 'https://example.com/avatar.jpg'
    };
    const user = { email: 'test@example.com' };

    render(<UserAvatar profile={profile} user={user} />);
    
    const img = screen.getByAltText('User avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('displays username initial when no avatar_url', () => {
    const profile = { username: 'testuser' };
    const user = { email: 'test@example.com' };

    render(<UserAvatar profile={profile} user={user} />);
    
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('displays email initial when no username', () => {
    const profile = {};
    const user = { email: 'john@example.com' };

    render(<UserAvatar profile={profile} user={user} />);
    
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('displays question mark when no profile or user data', () => {
    render(<UserAvatar profile={{}} user={{}} />);
    
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('converts initial to uppercase', () => {
    const profile = { username: 'alice' };
    const user = { email: 'alice@example.com' };

    render(<UserAvatar profile={profile} user={user} />);
    
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('handles null profile and user', () => {
    render(<UserAvatar profile={null} user={null} />);
    
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('prefers username over email for initial', () => {
    const profile = { username: 'bob' };
    const user = { email: 'alice@example.com' };

    render(<UserAvatar profile={profile} user={user} />);
    
    // Should show 'B' from username, not 'A' from email
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
