'use client'

import { Button } from '@material-tailwind/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MainHeader() {
  const router = useRouter()
  const logout = () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  return (
    <div className="flex items-center justify-start w-full mb-2 gap-1 z-10 [&>*>img]:h-[80px] [&>a]:flex">
      <Link href="/main" className=" duration-300 cursor-pointer">
        <img src="/images/icon_001_battle.png" />
      </Link>
      <Link href="/main/skill" className=" duration-300 cursor-pointer">
        <img src="/images/icon_002_skill.png" />
      </Link>
      {/* <Link href="/main/shop" className=" duration-300 cursor-pointer"> */}
      {/*  <img src="/images/icon_003_shop.png" /> */}
      {/* </Link> */}
      <Link href="/main/inn/stash" className=" duration-300 cursor-pointer">
        <img src="/images/icon_007_inn.png" />
      </Link>
      {/* <Link href="/main/gatcha" className=" duration-300 cursor-pointer"> */}
      {/*  <img src="/images/icon_004_gatcha.png" /> */}
      {/* </Link> */}
      <Link href="/main/community" className="  duration-300 cursor-pointer">
        <img src="/images/icon_005_community.png" />
      </Link>
      <Link href="/main/rank" className="  duration-300 cursor-pointer">
        <img src="/images/icon_006_rank.png" />
      </Link>
      <Link href="/main/collection" className="  duration-300 cursor-pointer">
        <img src="/images/icon_008_collection.png" />
      </Link>
      {/* <Link */}
      {/*  className="w-20 ml-auto bg-white shadow-md hover:drop-shadow-lg rounded-full h-full hover:scale-125 duration-300 flex justify-center flex-col items-center" */}
      {/*  href="/admindooboo" */}
      {/*  target="_blank" */}
      {/* > */}
      {/*  <div>관리자</div> */}
      {/*  <div>페이지</div> */}
      {/* </Link> */}
      <button
        className="ml-auto w-20 max-h-20 bg-white shadow-md hover:drop-shadow-lg rounded-full h-full duration-300"
        onClick={() => logout()}
      >
        로그아웃
      </button>
    </div>
  )
}
