"use client"
import { useDispatch } from 'react-redux';
import { login } from '@/store/userSlice';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  async function handleLogin(){
    setIsSubmiting(true)
    const response = await axios.post('/api/auth/login',{
      email,
      password
    })
    if (response.data.status) {
      localStorage.removeItem('token')
      const token = response.data?.token
      localStorage.setItem('token',token)
      dispatch(login(response.data?.user))
      router.push('/');
    } else {
      setIsSubmiting(false)
      toast.error(response.data.message,{
        position: "bottom-right"
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 p-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        <form className="space-y-3">
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
            onClick={() => handleLogin()}
            className="w-full mt-6 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            disabled={isSubmiting}
          >
            {
              isSubmiting ? <div className='flex items-center justify-center'>
                <Loader2 className="h-6 w-6 animate-spin text-center" size={20} />
                please wait...
              </div>:
              'Log in'
            }
          </button>

          <button
            type="button" onClick={() => handleLogin()}
            className="w-full bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            disabled={isSubmiting}
          >
            {
              isSubmiting ? <div className='flex items-center justify-center'>
                <Loader2 className="h-6 w-6 animate-spin text-center" size={20} />
                please wait...
              </div>:<div className='flex items-center justify-center'> 
                <img src="https://cdn3.iconfinder.com/data/icons/logos-brands-3/24/logo_brand_brands_logos_google-1024.png" className='h-6 max-w-6 mr-2' alt="" />
                Login With Google
              </div>
            }
          </button>
        </form>
        <div className='flex justify-between items-center mt-3'>
          
          <p>
            <Link href="/forgotPassword" className="text-gray-600 hover:text-gray-700">
            Forgot Password?
            </Link>
          </p>
          <p>
            <Link href="/auth/signup" className="text-gray-600 hover:text-gray-700">
              Sign up
            </Link>
          </p>
          
        </div>
      </div>
    </div>
  );
}
