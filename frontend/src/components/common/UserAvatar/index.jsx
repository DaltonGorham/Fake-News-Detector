import './styles.css';

export default function UserAvatar({ profile, user }) {
  const initial = profile?.username?.[0] || user?.email?.[0] || '?';
  
  return (
    <div className="user-avatar">
      {profile?.avatar_url ? (
        <img src={profile.avatar_url} alt="User avatar" />
      ) : (
        initial.toUpperCase()
      )}
    </div>
  );
}
