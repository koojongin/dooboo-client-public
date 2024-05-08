'use client'

import { redirect, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { RedirectType } from 'next/dist/client/components/redirect'

export default function LoginTokenButton() {
  const router = useRouter()

  const addUrlParameter = () => {
    const url = `?date${new Date().getTime()}`
    const urlInstance = new URL(window.location.href)
    const urlParams = urlInstance.searchParams
    const characterId = localStorage.getItem('characterId') || ''
    urlParams.set('token', characterId)
    window.location.href = urlInstance.href
  }
  return (
    <div
      className="bg-green-500 px-[10px] py-[4px] text-white"
      onClick={() => {
        addUrlParameter()
      }}
    >
      토큰으로 넘어가기
    </div>
  )
}
