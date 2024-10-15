'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { set } from 'mongoose';

export default function Reset({params}:
  {params :{
      slug: string[]
  }}) {
  const [password, setPassword] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmiting(true);

    const response = await axios.post(`/api/auth/resetPasswordConf?id=${params.slug[0]}&hashed=${params.slug[1]}`,{
      password,
    })

    if (response.data.status) {
      toast.success(response.data.message);
      router.push('/signin');
    } else {
      setIsSubmiting(false)
      toast.error(response.data.message,{
        position: "bottom-right"
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 p-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full mt-6 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            disabled={isSubmiting}
          >
            {
              isSubmiting ? <div className='flex items-center justify-center'>
                <Loader2 className="h-6 w-6 animate-spin text-center" size={20} />
                please wait...
              </div>:
              'Submit'
            }
          </button>
        </form>
        
          
          <p className='mt-1'>
            <Link href="/signin" className="text-gray-600 hover:text-gray-700">
            Sign in
            </Link>
          </p>
      </div>
    </div>
  );
}
