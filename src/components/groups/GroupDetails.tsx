import React from 'react'
import { User2, X } from 'lucide-react';
import { User } from 'lucide-react';
import { UserState } from '@/store/userSlice';
import { CldImage } from 'next-cloudinary';

interface friendDetails{
  name: string,
  description: string,
  members: UserState[],
  admins: UserState[],
  member: UserState[],
  setDetails: React.Dispatch<React.SetStateAction<boolean>>,
  createdBy: UserState,
  createdAt: string
}


const GroupDetails:React.FC<friendDetails> = ({name, description, members, member, admins ,setDetails, createdBy, createdAt}) => {
  return (
    <div className='bg-gray-950 h-screen  overflow-y-scroll scrollbar-thin'>
        <div className='fixed top-0 p-5 z-50 h-14 w-full flex justify-start bg-gray-700'>
                <X  color='#bbb'  className='text-white inline-block cursor-pointer' onClick={() => setDetails(false)}/>
                <p className='text-white inline-block ml-7 '>Group info</p>
            </div>
        <div className='p-5 pl-7 bg-gray-700'>
            
            <User className='m-auto mt-10 bg-slate-500 rounded-full' size={200} />
            <div className='text-center'>
                <p className='mt-3 text-2xl font-normal text-[#bbb]'>{name}</p>
                <p className='mt-1 text-[#999]'>{members.length} members</p>
            </div>
        </div>

        <div className='p-5 pl-7 mt-2 bg-gray-700'>
            <p >Group created by {createdBy.username}, on {new Date(createdAt).toLocaleDateString()} at {new Date(createdAt).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</p>
            <p className='text-[#999]'>About</p>
            <p className='text-[#bbb] text-xl font-normal'>{description}</p>
        </div>
        <div className='p-5 px-8 mt-2 bg-gray-700'>
            <div className='flex justify-between'>
                <p className='text-[#999]'>{members.length} Members</p>
                <p className='text-[#999]'>Members</p>
            </div>
            <div className='mt-2'>
                {
                    admins.map((member:UserState) => (
                        <div>
                        <div className='flex justify-start p-3 gap-3 hover:bg-gray-500'>
                        {
                            member.profileImgUrl != null
                            ? <CldImage height={200} width={200} src={member.profileImgUrl} alt="profile img" className='h-[48px] w-[48px] object-cover rounded-full cursor-pointer mt-1' />
                            : <User size={48} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1'/>
                        }
                        <div className='w-11/12'>
                            <div className='flex justify-between items-center'>
                               <div>
                                    <p className='text-white text-xl'>{member.username}</p>
                                    <p className='text-[#ccc] text-xs'>Admin</p>
                                </div> 
                                <p className='text-white text-xs'>{member.email}</p>
                            </div>
                            <p className='text-white text-sm'>{member.about}</p>
                        </div>
                    </div>
                    <hr className=" ml-14 border-gray-600 border-t" />
                </div>
                    ))
                }
                {
                    member.map((member:UserState) => (
                        <div>
                        <div className='flex justify-start p-3 gap-3 hover:bg-gray-500'>
                        {
                            member.profileImgUrl != null
                            ? <CldImage height={200} width={200} src={member.profileImgUrl} alt="profile img" className='h-[48px] w-[48px] object-cover rounded-full cursor-pointer mt-1' />
                            : <User size={48} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1'/>
                        }
                        <div className='w-11/12'>
                            <div className='flex justify-between items-center'>
                                <p className='text-white text-xl'>{member.username}</p>
                                <p className='text-white text-xs'>{member.email}</p>
                            </div>
                            <p className='text-white text-sm'>{member.about}</p>
                        </div>
                    </div>
                    <hr className=" ml-14 border-gray-600 border-t" />
                </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default GroupDetails