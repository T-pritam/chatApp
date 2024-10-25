import React from 'react'
import { IoClose } from "react-icons/io5";
import { useState,useEffect } from 'react';
import { UserState } from '@/store/userSlice';
import { User } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { useDispatch,useSelector } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import { adduser, removeuser, deleteall } from '@/store/groupSlice';


function CreateGroup(props : {
    setCreate : React.Dispatch<React.SetStateAction<boolean>>,
    setCreate2 : React.Dispatch<React.SetStateAction<boolean>>,
    setAll : React.Dispatch<React.SetStateAction<boolean>>,

}) {
    const dispatch = useDispatch()
    const GroupMembers = useSelector((state:RootStateType) => state.group)
    const friends = useSelector((state:RootStateType) => state.friends)
    const [searchText,setSearchText] = useState<string>("")
    const [fetchFriends,setFetchFriends] = useState<UserState[]>([])

    useEffect(() => {
        setFetchFriends(friends.friends)
    },[])

    useEffect(() => {
        if(searchText.trim() != "") {
            setFetchFriends(friends.friends.filter((f) => f.username.toLowerCase().includes(searchText.toLowerCase()) || f.email.toLowerCase().includes(searchText.toLowerCase())))
        } else {
            setFetchFriends(friends.friends.filter((f) => !GroupMembers.group.some((g) => g.username == f.username)))
        }
    },[searchText])

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
        <div className=' '>
        <div className='w-full h-12 my-auto p-4 mb-2'>
            <IoClose size={35} color='#bbb' className='pl-2 cursor-pointer inline-block' onClick={() => {
                props.setCreate(false)
                props.setAll(true)
                props.setCreate2(false)
                dispatch(deleteall())
            }}/>
            <p className='text-[#ccc] text-lg inline-block ml-8 my-auto'>Add group members</p>
        </div>
        <div className='mt-2 px-4 max-h-32 overflow-y-auto scrollbar-thin'>        
        {
            GroupMembers.group.length == 0
            ? <div></div>
            : GroupMembers.group.map((users:UserState) => (
                <div className='inline-block mx-2'>
                    <User size={27} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1 inline-block'/>
                    <p className='text-white text-sm my-auto inline-block mt-2 ml-2'>{users.username}</p>
                    <IoClose className='text-white text-sm my-auto inline-block ml-2 cursor-pointer hover:border hover:bg-[#ddd] hover:text-black rounded-full' onClick={() => {
                        dispatch(removeuser(users))
                        setFetchFriends([...fetchFriends,users])
                    }} />
                </div>
            ))
        }
        </div>
        <div className='px-8 mb-2 mt-2'>
            <input type=" text" className='bg-gray-700 border-b border-[#888] text-[#eee] outline-none w-full' placeholder='Search name or mail'
                onChange={(e) => setSearchText(e.target.value)} value={searchText} 
            />
        </div>
        </div>
        <div className='flex-1 overflow-y-auto h-screen scrollbar-thin'>
        {
            fetchFriends?.length == 0 
            ? <p className='text-[#aaa] text-xl my-auto text-center mt-24'>No Friends Found</p>
            : fetchFriends?.map((users) => (
                <div className='hover:bg-gray-600 cursor-pointer' onClick={() => {
                    dispatch(adduser(users))
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
        {
            GroupMembers.group.length == 0
            ? <div></div>
            : 
             <div className='w-full h-20 flex justify-center items-center'>
                    <div className='h-12 w-12 bg-[#00a884] rounded-full mx-auto '>
                        <ArrowRight size={25}  strokeWidth={2} color='#bbb' className='cursor-pointer mx-auto mt-3' onClick={() => {
                            props.setCreate2(true)
                            props.setCreate(false)
                            props.setAll(false)
                        }}/>
                    </div>
                    
                </div>
        }
        

    </div>
    )
}

export default CreateGroup