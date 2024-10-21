import React from 'react'
import UserNavbar from './UserNavbar'

interface friendDetails{
  username: string,
  about: string,
  email: string
}

const ChatMessage:React.FC<friendDetails> = ({username, about, email}) => {
  return (
    <div>
      <UserNavbar username = {username}/>
    </div>
  )
}

export default ChatMessage