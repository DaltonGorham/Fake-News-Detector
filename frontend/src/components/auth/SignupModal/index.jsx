import React, { useState } from 'react';
import './styles.css';

export default function SignupModal({ onClose, onSignup, status }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSignup(formData.email, formData.password, formData.username);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Sign Up</h2>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <div className="modal-buttons">
          <button id="signup-btn" onClick={handleSubmit}>Sign Up</button>
          <button id="close-btn" onClick={onClose}>Cancel</button>
        </div>
        <p id="status">{status}</p>
      </div>
    </div>
  );
}