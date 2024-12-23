"use client"
import React from 'react'
import { LogOut } from 'lucide-react';
import { Search } from 'lucide-react';
import { User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import {useState,useEffect } from 'react';
import '@/components/css/scrollbar.css';
import { IoClose } from "react-icons/io5";
import { UserState } from '@/store/userSlice';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import CreateGroup from './CreateGroup';
import axios from 'axios';

function AllGroup(props : {
    setAll : React.Dispatch<React.SetStateAction<boolean>>,
    setCreate : React.Dispatch<React.SetStateAction<boolean>>,
    setCreate2 : React.Dispatch<React.SetStateAction<boolean>>
}) {
    const router = useRouter()
    const user = useSelector((state:RootStateType) => state.user)
    const [grp,setgrp] = useState<any[]>([])
    const [grptemp,setgrpTemp] = useState<any[]>([])
    const [searchBtn,setSearchBtn] = useState<string>("")
    const [searchText,setSearchText] = useState<string>("")
    const [defaultBtn,setDefaultBtn] = useState<boolean>(true)
    const [createBtn,setCreateBtn] = useState<boolean>(false)
    const [all,setAll] = useState<boolean>(false)
    const [debouncedSearchText] = useDebounce(searchBtn, 800);

    useEffect(() => {
        setSearchText(debouncedSearchText.trim())
    },[debouncedSearchText])

    useEffect(() => {
        const fetchGroups = async () => {
            const grp = await axios.get('http://localhost:3000/api/groups/getById?id='+user._id)
            setgrp(grp.data.group)
            setgrpTemp(grp.data.group)
        }
        fetchGroups()
    },[])

    useEffect(() => {
        if (searchText.trim() == "") {
            setgrpTemp(grptemp)
        } else {
        const fetchgrp = grp.filter((g) => g.groupName.toLowerCase().includes(searchText.toLowerCase()))
        setgrpTemp(fetchgrp)
    }
    },[searchText])
    
  return (
    <div className=' border border-gray-500 h-screen overflow-y-scroll scrollbar-thin' >
        <div className='sticky top-0 z-10 bg-gray-700 pb-2 p-4'>
            <div className='flex justify-between'>
                <p className='text-2xl font-bold text-white'>Groups</p>
                <LogOut color='#bbb' className='cursor-pointer select-bg-red-600' onClick={() => {
                    localStorage.removeItem('token')
                    router.push('/auth/signin')
                }}/>
            </div>  

            <div className='mt-6 bg-gray-500 rounded-xl'>
                
                <Search size={20} stroke='#bbb' className='inline-block absolute ml-4 mt-2'/>
                <input type="text" value={searchBtn} className='w-full h-9 bg-gray-500 p-1 px-14 rounded-xl outline-none' placeholder='Search' onChange={(e) => setSearchBtn(e.target.value)}/>
                {
                    searchBtn.trim() == ""
                    ? null
                    : <IoClose size={20} color='#bbb' className='absolute right-6 inline-block mt-2 cursor-pointer' onClick={() => {
                        setSearchBtn("")
                    }}/>
                }
                
            </div>

            <div className='flex justify-start mt-3 gap-3'>
                <button className={`p-1 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] hover:bg-gray-500/35 ${all ? "bg-gray-500/35" : ""}`}  onClick={() => {
                    props.setAll(true)
                    props.setCreate(false)
                    props.setCreate2(false)
                }}>All</button>
                <button className={`p-1 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] hover:bg-gray-500/55 ${createBtn ? "bg-gray-500/55" : ""}`} onClick={() => {
                    props.setAll(false)
                    props.setCreate2(false)
                    props.setCreate(true)
                }}>Create Group</button>
            </div>

        </div>

        
        <div>
            {
                grptemp.length == 0
                ? <p className='text-[#aaa] text-xl my-auto text-center mt-24'>No Groups</p>
                : grptemp.map((g) => (
                    <div>
                        <div className='flex justify-start p-3 gap-3 hover:bg-gray-500'>
                            <User size={48} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1'/>
                            <div className='w-5/6'>
                                <p className='text-white text-xl'>{g.name}</p>
                                <p className='text-white text-sm'>{g.members.length} members</p>
                            </div>
                        </div>
                        <hr className=" ml-14 border-gray-600 border-t" />
                    </div>
                ))
            }
        </div>
        
        
    </div>
  )
}

export default AllGroup;