'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await axios.post('/api/auth/login',{
      email,
      password
    })

    if (response.data.status) {
      router.push('/');
    } else {
      toast.error(response.data.message,{
        position: "bottom-right"
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 p-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
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
            className="w-full bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Login
          </button>
        </form>
        <div className='flex justify-between items-center mt-3'>
          
          <p>
            <Link href="/signup" className="text-gray-600 hover:text-gray-700">
            Forgot Password?
            </Link>
          </p>
          <p>
            <Link href="/signup" className="text-gray-600 hover:text-gray-700">
              Sign up
            </Link>
          </p>
          
        </div>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
