"use Client"
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import { useRouter } from 'next/router';

export default async function Profile(){
  const user = useSelector((state:RootStateType) => state.user)
  const router = useRouter();

  useEffect(() => {
    if(!localStorage.getItem('token')){
      router.push('/auth/signin')
    } else {
      if(user?._id == ""){
        router.push('/chat')
      }
      
    }
  },[])
  return (
           <div className='flex'>
                    
           </div>
  );
}

