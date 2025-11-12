import { useState } from 'react';
import { getPasswordStrength } from '../../../util/validator';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import './styles.css';

export default function PasswordInput({ 
  id,
  name,
  value, 
  onChange, 
  placeholder = "Password",
  disabled = false,
  autoFocus = false,
  showStrength = false,
  error = false,
  className = ''
}) {
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = getPasswordStrength(value);

  return (
    <div className="password-input-container">
      <div className="password-input-wrapper">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={error ? `error ${className}` : className}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {showPassword ? <HiEyeOff /> : <HiEye />}
        </button>
      </div>
      {showStrength && value && !error && (
        <div className="password-strength">
          <div className="strength-bar">
            <div 
              className="strength-fill" 
              style={{ 
                width: `${passwordStrength.strength}%`,
                backgroundColor: passwordStrength.color
              }}
            />
          </div>
          <span className="strength-label" style={{ color: passwordStrength.color }}>
            {passwordStrength.label}
          </span>
        </div>
      )}
    </div>
  );
}
