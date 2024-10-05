'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from 'use-debounce';
import axios,{ AxiosError } from 'axios';
import ApiResponse from '@/schema/apiResponse';
import { Loader2 } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  
  const router = useRouter();
  const { toast } = useToast();
  const [debouncedUsername] = useDebounce(username, 1000);;

  useEffect( () => {
    const checkingUsernameUnique = async () => {
      if(debouncedUsername.trim() === ""){
        setIsCheckingUser(false)
        setUsernameMessage("")
      }
      if (debouncedUsername) {
        console.log(debouncedUsername)
        setIsCheckingUser(true);
        setUsernameMessage('');
        try {
          const respose = await axios.get(`/api/auth/checkusername?username=${debouncedUsername}`)
          setUsernameMessage(respose.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        }
        finally{
          setIsCheckingUser(false)
        }
      }
    }
    checkingUsernameUnique()
    }, [debouncedUsername] )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmiting(true);
    try {
      const response = await axios.post(`/api/auth/signup`, {
        email,
        username,
        password
      })
      toast({
        title : 'success',
        description : response.data.message
      })
      router.replace(`/verify-code/${username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message??
      ('There was a problem with your sign-up. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsSubmiting(false)
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6 text-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-5 text-center">Signup</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none'>
            {isCheckingUser && <Loader2 className="animate-spin" size={20} />}
          </div>
        
          
          


          {!isCheckingUser && usernameMessage && (
                    <p
                      className={`text-sm text-left absolute  mt-0 pl-2 ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500 '
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
          </div>
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
            className="w-full mt-6 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
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
