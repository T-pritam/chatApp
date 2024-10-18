"use client"
import React, { useEffect,useState } from 'react'
import { User } from 'lucide-react';
import { useSelector,useDispatch } from 'react-redux';
import { updateUsername,updateAbout } from '@/store/userSlice';
import { RootStateType } from '@/store/userStore';
import { MdModeEdit } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { useRouter } from 'next/navigation';
import { set } from 'mongoose';
import axios from 'axios';

function Details() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootStateType) => state.user);
  const [editUsername, setEditUsername] = useState(false)
  const [editAbout, setEditAbout] = useState(false)
  const [username, setUsername] = useState('')
  const [about, setAbout] = useState('')

  useEffect(() => {
    if(user._id == "") {
      router.push('/chat')
    } 
  })

  async function editUsernameFunc() {
    if(editUsername && username != '') {
        await axios.post('/api/user/updateuser?id='+user._id, {
          username
        })
        dispatch(updateUsername({username}))
        setUsername("")
    }
    setEditUsername(!editUsername)
  }

  async function editAboutFunc() {
    if(editAbout && about != '') {
        await axios.post('/api/user/updateuser?id='+user._id, {
          about
        })
        dispatch(updateAbout({about}))
        setAbout("")
    }
    setEditAbout(!editAbout)
  }

  return (
    <div className='overflow-hidden'>
        <div>
            <p className='p-4 text-[#ddd] text-2xl font-bold'>Profile</p>
        </div>
        <div className='p-6 mx-auto text-center'>
            <User size={'12rem'} strokeWidth={1} color='#bbb' className='rounded-full mx-auto bg-gray-500 cursor-pointer'/>
            <p className='text-md text-[#ddd]'>{user.email}</p>
        </div>

        <div className=' p-5'>
            <p className='text-md  text-white'>Your name</p>
            <div >
                { 
                  editUsername 
                  ? <div className='flex justify-between mt-3'>
                      <input type="text" className='w-full text-xl color-[#ccc] rounded-md bg-gray-700 outline-none' placeholder={user.username}  onChange={(e) => setUsername(e.target.value)}/>
                      <TiTick color='#bbb' size={'2vw'} className='cursor-pointer select-bg-red-600' onClick={editUsernameFunc}/>  
                    </div>
                  : 
                    <div className='flex justify-between mt-3'>
                      <p className='text-[#ccc] text-xl'>{user.username}</p>
                      <MdModeEdit color='#bbb' size={'2vw'} className='cursor-pointer select-bg-red-600' onClick={editUsernameFunc}/> 
                    </div>
                }
            </div>
            

            <p className='text-md text-white mt-6'>About</p>
            <div >
            { 
                  editAbout 
                  ? <div className='flex justify-between mt-3'>
                      <input type="text" className='w-full text-xl color-[#ccc] rounded-md bg-gray-700 outline-none' placeholder={user.about} onChange={(e) => setAbout(e.target.value)}/>
                      <TiTick color='#bbb' size={'2vw'} className='cursor-pointer select-bg-red-600' onClick={editAboutFunc}/>  
                    </div>
                  : 
                    <div className='flex justify-between mt-3'>
                      <p className='text-[#ccc] text-xl'>{user.about}</p>
                      <MdModeEdit color='#bbb' size={'2vw'} className='cursor-pointer select-bg-red-600' onClick={editAboutFunc}/> 
                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default Details