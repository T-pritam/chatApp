"use client"
import React, { useEffect,useState,useRef } from 'react'
import { User } from 'lucide-react';
import { useSelector,useDispatch } from 'react-redux';
import { updateUsername,updateAbout,updateProfileImgUrl } from '@/store/userSlice';
import { RootStateType } from '@/store/userStore';
import { CldImage } from 'next-cloudinary';
import { MdModeEdit } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { Check } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import axios,{ AxiosError } from 'axios';
import { IoCamera } from "react-icons/io5";
import ApiResponse from '@/schema/apiResponse';

function Details() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootStateType) => state.user);
  const [editUsername, setEditUsername] = useState<boolean>(false)
  const [editAbout, setEditAbout] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [usernameMessage, setUsernameMessage] = useState<string>('');
  const [isCheckingUser, setIsCheckingUser] = useState<Boolean>(false);
  const [about, setAbout] = useState<string>('')
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [debouncedUsername] = useDebounce(username, 1000);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect( () => {
    const checkingUsernameUnique = async () => {
      if(debouncedUsername.trim() === ""){
        setIsCheckingUser(false)
        setUsernameMessage("")
      }
      if (debouncedUsername) {
        setIsCheckingUser(true);
        setUsernameMessage('');
        try {
          const respose = await axios.get(`/api/user/checkusername?username=${debouncedUsername}`)
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

  useEffect(() => {
    if(user._id == "") {
      router.push('/chat')
    } 
    console.log("user : ",user)
  },[])

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

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('senderId', user._id);
      formData.append('file', file);
      const res = await axios.post('/api/uploadProfileImg', formData);
      dispatch(updateProfileImgUrl({ profileImgUrl: res.data.fileUrl }));
      } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className='overflow-hidden'>
        <div>
            <p className='p-4 text-[#ddd] text-2xl font-bold'>Profile</p>
        </div>
        <div className='p-6 mx-auto text-center relative h-1/2'>
        <div className="w-[12rem] h-[12rem] rounded-full mx-auto cursor-pointer" onClick={handleIconClick}>
        {fileUrl || user.profileImgUrl != "" ? (
          <CldImage 
            src={user.profileImgUrl} 
            alt='Profile Image'
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-full" 
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center">
            <User size="100%" strokeWidth={1} color="#bbb" />
          </div>
        )}
      </div>
        {/* <User size={'12rem'} strokeWidth={1} color='#bbb' className='rounded-full mx-auto bg-gray-600 cursor-pointer' onClick={handleIconClick}/> */}
        <p className='text-md text-[#ddd]'>{user.email}</p>
          <input type="file" accept="image/*" ref={fileInputRef} className='hidden' onChange={handleFileChange} />
          <div className='absolute top-1/3 left-[43%]'>
            <label onClick={handleIconClick} className='cursor-pointer'>
              <IoCamera size={30} color='#ccc' className='ml-5'/>
              <p className='text-[#ccc]'>Add Profile <br/> Image</p>
            </label>
          </div>
        </div>

        <div className=' p-5'>
            <p className='text-md  text-white'>Your name</p>
            <div >
                { 
                  editUsername 
                  ? <div className='flex justify-between mt-3'>
                      <input type="text" className='w-full text-xl color-[#ccc] rounded-md bg-gray-700 outline-none text-[#ddd]' placeholder={user.username}  onChange={(e) => setUsername(e.target.value)}/>
                      <Check color='#bbb' size={'2vw'} className='cursor-pointer select-bg-red-600' onClick={editUsernameFunc}/>  
                    </div>
                  : 
                    <div className='flex justify-between mt-3'>
                      <p className='text-[#ccc] text-xl'>{user.username}</p>
                      <MdModeEdit color='#bbb' size={'2vw'} className='cursor-pointer select-bg-red-600' onClick={editUsernameFunc}/> 
                    </div>
                }
            </div>
            <hr />

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

            <p className='text-md text-white mt-6'>About</p>
            <div >
            { 
                  editAbout 
                  ? <div className='flex justify-between mt-3'>
                      <input type="text" className='w-full text-xl color-[#ccc] rounded-md bg-gray-700 outline-none text-[#ddd]' placeholder={user.about} onChange={(e) => setAbout(e.target.value)}/>
                      <Check color='#bbb' size={'2vw'} className='cursor-pointer select-bg-red-600' onClick={editAboutFunc}/>  
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