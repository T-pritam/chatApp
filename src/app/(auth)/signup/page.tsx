'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDebounce } from 'usehooks-ts';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const debouncedUsername = useDebounce(username, 800);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6 text-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Signup</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>
        </form>
        <p className='mt-6'>
            Already a member?{' '}
            <Link href="/signin" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
        </p>
      </div>
    </div>
  );
}
