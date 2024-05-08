'use client'

import { Button } from '@material-tailwind/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MainHeader() {
  const router = useRouter()
  const logout = () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('token')
    localStorage.removeItem('characterId')
    localStorage.removeItem('nickname')
    window.location.href = '/'
  }

  return (
    <div className="flex items-center justify-start w-full mb-2 gap-1 [&>*>img]:h-[80px] [&>a]:flex">
      <Link href="/main" className=" duration-300 cursor-pointer">
        <img src="/images/icon_001_battle.png" />
      </Link>
      <Link href="/main/skill" className=" duration-300 cursor-pointer">
        <img src="/images/icon_002_skill.png" />
      </Link>
      <Link href="/main/inn/stash" className=" duration-300 cursor-pointer">
        <img src="/images/icon_007_inn.png" />
      </Link>
      <Link href="/main/community" className="  duration-300 cursor-pointer">
        <img src="/images/icon_005_community.png" />
      </Link>
      <Link href="/main/rank" className="  duration-300 cursor-pointer">
        <img src="/images/icon_006_rank.png" />
      </Link>
      <Link
        href="/main/collection/maps"
        className="duration-300 cursor-pointer"
      >
        <img src="/images/icon_008_collection.png" />
      </Link>
      <Link
        href="/main/messages"
        className="duration-300 cursor-pointer relative"
      >
        <img src="/images/icon_010_message.png" />
      </Link>
      <button
        className="ml-auto w-20 max-h-20 bg-white shadow-md hover:drop-shadow-lg rounded-full h-full duration-300"
        onClick={() => logout()}
      >
        로그아웃
      </button>
    </div>
  )
}
