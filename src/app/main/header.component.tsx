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
    <div className="flex items-stretch justify-start w-full mb-2 gap-1 [&>*>img]:h-[80px] [&>a]:flex">
      <Link href="/main/battle" className=" duration-300 cursor-pointer">
        <img src="/images/icon_001_battle.png" />
      </Link>
      <Link href="/main/gatcha" className=" duration-300 cursor-pointer">
        <img src="/images/icon_004_gatcha.png" />
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
      <Link
        target="_blank"
        href="/main/community/detail/6683e307c9638e8b6885783c"
        className="ml-auto duration-300 cursor-pointer relative shadow-md shadow-gray-600 overflow-hidden"
      >
        <div className="text-[20px] ff-score-all font-bold flex flex-col items-center justify-center p-[10px] bg-gradient-to-t from-blueGray-900/85 to-gray-700 text-white shadow-md hover:drop-shadow-lg rounded h-full duration-300">
          <div>클라이언트</div>
          <div>다운로드</div>
        </div>
      </Link>
      <Link
        target="_blank"
        href="https://discord.gg/PPzN9SWxJQ"
        className="duration-300 cursor-pointer relative"
      >
        <div className="flex items-center justify-center w-20 max-h-20 bg-white shadow-md hover:drop-shadow-lg rounded-full h-full duration-300">
          디스 코드
        </div>
      </Link>
      <button
        className="w-20 max-h-20 bg-white shadow-md hover:drop-shadow-lg rounded-full h-full duration-300"
        onClick={() => logout()}
      >
        로그아웃
      </button>
    </div>
  )
}
