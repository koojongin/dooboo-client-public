'use client'

import Link from 'next/link'

export default function BlackSmithHeader() {
  return (
    <div className="flex items-center [&_div]:bg-white gap-[4px] [&_div]:min-w-[80px] [&_div]:flex [&_div]:items-center [&_div]:justify-center [&_div]:min-h-[30px] [&_div]:cursor-pointer [&_div]:px-[10px]">
      <Link
        href="/main/inn/black-smith/enhance"
        className="duration-300 cursor-pointer"
      >
        <div className="ff-ba ff-skew">스타포스 제련</div>
      </Link>
      <Link
        href="/main/inn/black-smith/reroll"
        className="duration-300 cursor-pointer"
      >
        <div className="ff-ba ff-skew">기본 속성 재설정</div>
      </Link>
      <Link
        href="/main/inn/black-smith/reroll-additional"
        className="duration-300 cursor-pointer"
      >
        <div className="ff-ba ff-skew">추가 속성 재설정</div>
      </Link>
      <Link
        href="/main/inn/black-smith/initialize-star-force"
        className="duration-300 cursor-pointer"
      >
        <div className="ff-ba ff-skew">스타포스 초기화</div>
      </Link>
      <Link
        href="/main/inn/black-smith/convert-attribute"
        className="duration-300 cursor-pointer"
      >
        <div className="ff-ba ff-skew">속성 전환</div>
      </Link>
      <Link
        href="/main/inn/black-smith/split-attribute"
        className="duration-300 cursor-pointer"
      >
        <div className="ff-ba ff-skew">속성 분할</div>
      </Link>
      <Link
        href="/main/inn/black-smith/enchant"
        className="duration-300 cursor-pointer"
      >
        <div className="ff-ba ff-skew">마법 부여</div>
      </Link>
      <Link
        href="/main/inn/black-smith/card-inject"
        className="duration-300 cursor-pointer"
      >
        <div className="ff-ba ff-skew">카드 주입</div>
      </Link>
    </div>
  )
}
