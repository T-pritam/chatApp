"use client"
import { Toaster } from 'sonner'

export default function SonnerProvider() {
  return <div>
  <Toaster position='bottom-right' expand={true} duration={2000} richColors/>
  </div>
}