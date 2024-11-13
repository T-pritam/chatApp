"use client"

import React from 'react'
import GroupMessage from '@/components/groups/GroupMessage'
import { useEffect,useState } from 'react'
import { UserType } from '@/model/User'
import { UserState } from '@/store/userSlice'
import GroupDetails from '@/components/groups/GroupDetails'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootStateType } from '@/store/userStore'
import axios from 'axios'
import UserNavbar from '@/components/UserNavbar'

interface groupType{
    _id : string,
    name : string,
    description : string,
    members : UserState[],
    admins : UserState[],
    createdBy : UserState,
    createdAt : string
}

function page({params}:{params :{ id : string }}) 
    {
        const friends = useSelector((state:RootStateType) => state.friends)
        const user = useSelector((state:RootStateType) => state.user)
        const Router = useRouter()
        const [Details, setDetails] = useState(false)
        const [members, setMembers] = useState<UserState[]>([])
        const [grp,setGrp] = useState<groupType | null>(null)
        useEffect(() => {
            if(!localStorage.getItem('token') || user._id == ""){
                Router.push(`/chat`)
            }
            const getGrpData = async () => {
                const response = await axios.get(`/api/groups?id=${params.id}`)
                if(response.data.status){
                    setGrp(response.data.group)
                    setMembers(response.data.members)
                } else {
                    Router.push(`/chat`)
                }
            }
            getGrpData()
        },[])
  return (
    <div>
        {
            grp == null
            ? <div>loading</div>
            :
        <div>
            {
            Details 
            ? <div onClick={() => setDetails(false)}>
                <GroupDetails  
                    name={grp.name} 
                    description = {grp.description} 
                    members = {grp.members}
                    admins = {grp.admins}
                    member = {members}
                    setDetails = {setDetails}
                    createdBy = {grp.createdBy}
                    createdAt = {grp.createdAt}
                />
              </div>
            : <GroupMessage id={grp._id} name={grp.name} members={grp.members.length} setDetails={setDetails}/>
        }
        </div>
    }
    </div>
  )
}

export default page