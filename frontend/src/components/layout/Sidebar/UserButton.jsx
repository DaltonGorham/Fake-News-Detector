import UserAvatar from '../../common/UserAvatar';
import './UserButton.styles.css';

export default function UserButton({ profile, user, onClick }) {
  const displayName = profile?.username || 'Your Account';
  
  // Determine size class based on username length
  const getSizeClass = () => {
    if (!profile?.username) return '';
    if (profile.username.length <= 12) return 'username-short';
    if (profile.username.length >= 15) return 'username-long';
    return '';
  };
  
  return (
    <button className="user-button" onClick={onClick}>
      <UserAvatar profile={profile} user={user} />
      <span className={`username ${getSizeClass()}`} title={displayName}>
        {displayName}
      </span>
    </button>
  );
}
