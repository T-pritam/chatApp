"use client"
import * as React from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useParams } from "next/navigation"
import axios,{ AxiosError } from "axios"
import { toast } from 'react-toastify';
import ApiResponse from "@/schema/apiResponse"

export default function InputOTPControlled() {
  const params = useParams()
  const [value, setValue] = React.useState("")

  return (
    <div className="space-y-2 ml-auto mt-40">
      <p className="text-2xl">One-Time Password</p>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} className="w-14 h-14 text-center bg-gray-200 border border-gray-600 text-black-700 text-xl rounded focus:outline-none focus:bg-yellow-100"/>
          <InputOTPSlot index={1} className="w-14 h-14 text-center bg-gray-200 border border-gray-600 text-black-700 text-xl rounded focus:outline-none focus:bg-yellow-100"/>
          <InputOTPSlot index={2} className="w-14 h-14 text-center bg-gray-200 border border-gray-600 text-black-700 text-xl rounded focus:outline-none focus:bg-yellow-100"/>
          <InputOTPSlot index={3} className="w-14 h-14 text-center bg-gray-200 border border-gray-600 text-black-700 text-xl rounded focus:outline-none focus:bg-yellow-100"/>
          <InputOTPSlot index={4} className="w-14 h-14 text-center bg-gray-200 border border-gray-600 text-black-700 text-xl rounded focus:outline-none focus:bg-yellow-100"/>
          <InputOTPSlot index={5} className="w-14 h-14 text-center bg-gray-200 border border-gray-600 text-black-700 text-xl rounded focus:outline-none focus:bg-yellow-100"/>
        </InputOTPGroup>
      </InputOTP>
      
        <p>Please enter the one-time password sent to your mail.</p>
        <button className="rounded-md bg-slate-800 py-2.5 px-5 border border-transparent text-center text-base text-white transition-all shadow-sm hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
        type="submit" onClick={async() => {
          if (value.length == 6) {
            try {
              const response = await axios.post(`/api/verifycode`, {
              username : params.username,
              verificationCode : value
            })
            console.log(response.data.message)
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                console.log(axiosError.response?.data.message)
                toast.error(axiosError.response?.data.message)
            }
          }
          }}>
          Submit
        </button>
    </div>
  )
}