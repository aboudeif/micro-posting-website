'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { apiService } from '@/services/api.service';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (apiService.isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ textAlign: 'center', color: 'var(--primary-color)' }}>
          Micro-Posting
        </h1>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Welcome Back
        </h2>

        <LoginForm />

        <p
          style={{
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.875rem',
          }}
        >
          Using default credentials? Try: admin@example.com / password
        </p>
      </div>
    </div>
  );
}
