"use Client"
import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login } from '@/store/userSlice';

export default async function Profile(){
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    async function getUser(token:string){
      const response = await axios.get('/api/getUser?token='+token)
      if(response.data.status){
        dispatch(login(response.data.user))
        router.push('/chat')
      } else {
        localStorage.removeItem('token')
        router.push('/auth/signin')
      }
    }
    const token = localStorage.getItem('token')
    if (token){
      getUser(token)
    } else {
      router.push('/auth/signin')
    }
  },[])
  return (
           <div className='flex'>
                    
           </div>
  );
}

