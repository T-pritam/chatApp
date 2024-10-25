import React from 'react'
import { RootStateType } from "@/store/userStore";
import { useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import { User } from 'lucide-react';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axios from 'axios';

function CreateGroup2(props : {
    setCreate : React.Dispatch<React.SetStateAction<boolean>>,
    setCreate2 : React.Dispatch<React.SetStateAction<boolean>>,
    setAll : React.Dispatch<React.SetStateAction<boolean>>,

}) {
  const router = useRouter();
  const members = useSelector((state:RootStateType) => state.group)
  const memberids = members.group.map((m) => m._id)
  const user = useSelector((state:RootStateType) => state.user)
  const [isFocusedname, setIsFocusedname] = useState<boolean>(false);
  const [isFocuseddes, setIsFocuseddes] = useState<boolean>(false);
  const [groupname,setGroupname] = useState<string>("")
  const [groupdes,setGroupdes] = useState<string>("")

  return (
    <div>
        <div className='p-5'>
            <div className='w-full h-12 my-auto mb-2'>
              <FaArrowLeft size={20} strokeWidth={1} color='#bbb' className='cursor-pointer inline-block' onClick={() => {
                props.setCreate2(false)
                props.setAll(false)
                props.setCreate(true)
              }}/>
              <p className='inline-block ml-7 text-[#ddd] text-md'>New group</p>
            </div>
        </div>
        <div>
          <User size={200} strokeWidth={1} color='#bbb' className='mx-auto mt-1 bg-slate-600 rounded-full'/>
        </div>
        <div className='p-7  mt-2 relaive w-full'>
            <div className="relative w-full">
              <label htmlFor='name' className={`absolute left-0 transition-all duration-100 transform text-[#aaa] cursor-text ${ groupname != "" ? '-top-2  text-xs' : 'top-3  text-lg'}`} >Group name</label>
              <input id='name' type="text" className={`w-full bg-transparent outline-none mt-3  text-lg text-[#ddd]`} value={groupname} onFocus={() => setIsFocusedname(true)} onBlur={() => setIsFocusedname(false)} onChange={(e) => setGroupname(e.target.value)} autoComplete='off'/>
              <hr className={`w-full h-0.5 mt-1 transition-colors duration-300 ${isFocusedname ? 'bg-[#00a884] border-[#00a884]' : 'bg-white border-white'}`} />
            </div>
            <div className="relative w-full mt-6">
              <label htmlFor='des' className={`absolute left-0 transition-all duration-200 transform text-[#aaa] cursor-text ${groupdes != "" ? '-top-2 text-xs' : 'top-3  text-lg'}`} >Group subject (optional)</label>
              <input id='des' type="text" className={`z-10 w-full bg-transparent outline-none mt-3  text-lg text-[#ddd]`}value={groupdes} onFocus={() => setIsFocuseddes(true)} onBlur={() => setIsFocuseddes(false)} onChange={(e) => setGroupdes(e.target.value)} autoComplete='off'/>
              <hr className={`w-full h-0.5 mt-1 transition-colors duration-300 ${isFocuseddes ? 'bg-[#00a884] border-[#00a884]' : 'bg-white border-white'}`} />
            </div>
            <div className='w-full h-20 flex justify-center items-center mt-10'>
                    <div className='h-12 w-12 bg-[#00a884] rounded-full mx-auto cursor-pointer' onClick={async () => {
                         if(groupname.trim() == ""){
                          toast.error("Please enter group name",{
                            position: "bottom-right"
                          })} else {
                            const res = await axios.post('/api/groups/create', {name : groupname,description : groupdes, admins : user._id, members : memberids})
                            router.push(`/chat/group/${res.data.group._id}`)
                          }
                        }}>
                        <Check size={25}  strokeWidth={2} color='#bbb' className=' mx-auto mt-3' />
                    </div>
                </div>
        </div>
    </div>
  )
}

export default CreateGroup2