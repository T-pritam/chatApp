"use client"
import React from 'react'
import { useState } from 'react';
import CreateGroup from './CreateGroup';
import AllGroup from './AllGroup';
import CreateGroup2 from './CreateGroup2';
import '@/components/css/scrollbar.css';


function Grouplist() {
    const [createBtn,setCreateBtn] = useState<boolean>(false)
    const [createBtn2,setCreateBtn2] = useState<boolean>(false)
    const [all,setAll] = useState<boolean>(true)


    
  return (
    <div className=' border border-gray-500 h-screen overflow-y-scroll scrollbar-thin' >
        {
            createBtn && <CreateGroup setCreate={setCreateBtn} setAll={setAll} setCreate2={setCreateBtn2}/>
        } 
        {
            all  && <AllGroup setCreate={setCreateBtn} setAll={setAll} setCreate2={setCreateBtn2}/>
        }   
        {
            createBtn2 && <CreateGroup2 setCreate={setCreateBtn} setAll={setAll} setCreate2={setCreateBtn2}/>
        }     
        
    </div>
  )
}

export default Grouplist;