'use client'

import Link from 'next/link'

export default function BlackSmithHeader() {
  return (
    <div className="flex items-center [&_div]:bg-white gap-[4px] [&_div]:min-w-[80px] [&_div]:flex [&_div]:items-center [&_div]:justify-center [&_div]:min-h-[30px] [&_div]:cursor-pointer">
      <Link
        href="/main/inn/black-smith/enhance"
        className=" duration-300 cursor-pointer"
      >
        <div className="ff-ba ff-skew">강화</div>
      </Link>
      <Link
        href="/main/inn/black-smith/reroll"
        className=" duration-300 cursor-pointer"
      >
        <div className="ff-ba ff-skew">재설정</div>
      </Link>
    </div>
  )
}
