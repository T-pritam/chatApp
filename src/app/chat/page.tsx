
import React, { useEffect,useState } from 'react'
import ChatHome from '@/components/ChatHome'
import ChatMessage from '@/components/ChatMessage'
import { useSelector,useDispatch } from 'react-redux'
import { login } from '@/store/userSlice'
import { RootStateType } from '@/store/userStore'
import { useRouter } from 'next/navigation'
import { UserState } from '@/store/userSlice'
import axios from 'axios'



function Page() {
  const dispatch = useDispatch()
  const users = useSelector((state:RootStateType) => state.user)
  const router = useRouter()
  const [user, setUser] = useState({} as UserState)
  setUser(users)  

  useEffect(() => {

    // async function getUser(token:string){
    //   const response = await axios.get('/api/getUser?token='+token)
    //   // if(response.data.status){
    //   //   dispatch(login(response.data.user))
    //   // } else {
    //   //   localStorage.removeItem('token')
    //   //   router.push('/auth/signin')
    //   // }
    // }

    const token = localStorage.getItem('token')
    if(token && users._id == ""){
      const userData = axios.get('/api/getUser?token='+token).then((data) => console.log(data))
    }

  },[])
  

  return (
    <div>
      <ChatMessage/>
    </div>
  )
}

export default Page