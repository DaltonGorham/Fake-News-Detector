import React, { useState } from 'react';
import { validateEmail, validatePassword, validateUsername } from '../../../util/validator';
import PasswordInput from '../../common/PasswordInput';
import './styles.css';

export default function SignupModal({ onClose, onSignup, status }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateField = (field) => {
    try {
      if (field === 'email') {
        validateEmail(formData.email);
      } else if (field === 'password') {
        validatePassword(formData.password);
      } else if (field === 'username') {
        validateUsername(formData.username);
      }
      setErrors(prev => ({ ...prev, [field]: '' }));
      return true;
    } catch (err) {
      setErrors(prev => ({ ...prev, [field]: err.message }));
      return false;
    }
  };

  const handleSubmit = () => {
    const usernameValid = validateField('username');
    const emailValid = validateField('email');
    const passwordValid = validateField('password');

    // Only submit if all valid
    if (usernameValid && emailValid && passwordValid) {
      onSignup(formData.email, formData.password, formData.username);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Sign Up</h2>
        
        <div className="input-group">
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'error' : ''}
          />
          {errors.username && (
            <span className="error-message">{errors.username}</span>
          )}
          <span className="input-hint">3-15 characters, letters, numbers, hyphens, underscores</span>
        </div>

        <div className="input-group">
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="input-group">
          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            showStrength={true}
            error={errors.password}
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
          <span className="input-hint">Min 8 characters, uppercase, lowercase, number</span>
        </div>

        <div className="modal-buttons">
          <button id="signup-btn" onClick={handleSubmit}>Sign Up</button>
          <button id="close-btn" onClick={onClose}>Cancel</button>
        </div>
        {status && <p id="status">{status}</p>}
      </div>
    </div>
  );
}