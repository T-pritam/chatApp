import React from 'react'
import { IoClose } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import { useState,useEffect } from 'react';
import { UserState } from '@/store/userSlice';
import { User } from 'lucide-react';

function CreateGroup(props : {
    setCreate : React.Dispatch<React.SetStateAction<boolean>>,
    setAll : React.Dispatch<React.SetStateAction<boolean>>,

}) {
    const friends = useSelector((state:RootStateType) => state.friends)
    const [searchText,setSearchText] = useState<string>("")
    const [fetchFriends,setFetchFriends] = useState<UserState[]>()
    const [GroupMembers,setGroupMembers] = useState<UserState[]>([])

    useEffect(() => {
        setFetchFriends(friends.friends)
    },[])

    useEffect(() => {
        if(searchText.trim() != "") {
            setFetchFriends(friends.friends.filter((f) => f.username.toLowerCase().includes(searchText.toLowerCase()) || f.email.toLowerCase().includes(searchText.toLowerCase())))
        } else {
            setFetchFriends(friends.friends.filter((f) => !GroupMembers.some((g) => g.username == f.username)))
        }
    },[searchText])

  return (
    <div>
        <div className='w-full h-8 my-auto p-4'>
            <IoClose size={35} color='#bbb' className='pl-2 cursor-pointer inline-block' onClick={() => {
                props.setCreate(false)
                props.setAll(true)
            }}/>
            <p className='text-[#ccc] text-lg inline-block ml-8 my-auto'>Add group members</p>
        </div>
        {
            GroupMembers.length == 0
            ? <p className='text-[#aaa] text-xl my-auto text-center mt-24'>No Group Members</p>
            : GroupMembers?.map((users) => (
                <div className='inline-block mx-2'>
                    <User size={27} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1 inline-block'/>
                    <p className='text-white text-sm my-auto inline-block mt-2 ml-2'>{users.username}</p>
                    <IoClose className='text-white text-sm my-auto inline-block ml-2 cursor-pointer hover:border hover:bg-[#ddd] hover:text-black rounded-full' onClick={() => {
                        setGroupMembers(GroupMembers.filter((u) => u.username != users.username))
                        setFetchFriends([...fetchFriends,users])
                    }} />
                </div>
            ))
        }
        <div className='px-8 mb-4 mt-14'>
            <input type=" text" className='bg-gray-700 border-b border-[#888] text-[#eee] outline-none w-full' placeholder='Search name or mail'
                onChange={(e) => setSearchText(e.target.value)} value={searchText} 
            />
        </div>

        {
            fetchFriends?.length == 0 
            ? <p className='text-[#aaa] text-xl my-auto text-center mt-24'>No Friends Found</p>
            : fetchFriends?.map((users) => (
                <div className='hover:bg-gray-600 cursor-pointer' onClick={() => {
                    setGroupMembers([...GroupMembers,users])
                    setFetchFriends(fetchFriends.filter((u) => u.username != users.username))
                }}>
                    <div className='flex flex-row items-center gap-5 p-2'>
                        <User size={45} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1'/>
                        <p className='text-white text-xl my-auto'>{users.username}</p>
                    </div>
                    <hr className=" ml-16 border-[#888] border-t" />
                </div>
                
            ))
        }

    </div>
    )
}

export default CreateGroup