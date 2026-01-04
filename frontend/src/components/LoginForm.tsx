'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api.service';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormError('');

    if (!isValidEmail(email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);

    try {
      setIsLoading(true);
      await apiService.login({ email, password });
      router.push('/dashboard');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="loginForm" noValidate onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={emailError ? 'invalid-input' : ''}
          required
        />
        {emailError && (
          <div
            className="error-container"
            style={{ justifyContent: 'flex-start', marginTop: '5px' }}
          >
            <span
              className="error-icon"
              style={{ width: '16px', height: '16px', fontSize: '10px' }}
            >
              !
            </span>
            <span style={{ fontSize: '0.8rem' }}>Invalid email</span>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      {formError && (
        <div className="error-container">
          <span className="error-icon">!</span>
          <span>{formError}</span>
        </div>
      )}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
