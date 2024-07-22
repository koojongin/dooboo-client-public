'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import createKey from '@/services/key-generator'

export default function BlackSmithHeader() {
  const path = usePathname()
  const [menus] = useState([
    { name: '무기 스타포스 제련', href: '/main/inn/black-smith/enhance' },
    {
      name: '방어구 스타포스 제련',
      href: '/main/inn/black-smith/enhance-defence-gear',
    },
    { name: '제련 복구', href: '/main/inn/black-smith/enhance-recovery' },
    { name: '기본 속성 재설정', href: '/main/inn/black-smith/reroll' },
    {
      name: '추가 속성 재설정',
      href: '/main/inn/black-smith/reroll-additional',
    },
    {
      name: '스타포스 초기화',
      href: '/main/inn/black-smith/initialize-star-force',
    },
    { name: '속성 전환', href: '/main/inn/black-smith/convert-attribute' },
    { name: '속성 분할', href: '/main/inn/black-smith/split-attribute' },
    { name: '마법 부여', href: '/main/inn/black-smith/enchant' },
    { name: '카드 주입', href: '/main/inn/black-smith/card-inject' },
    { name: '명품화', href: '/main/inn/black-smith/imprinting' },
  ])
  return (
    <div className="flex flex-wrap items-center gap-[4px] max-w-[800px]">
      {menus.map((menu) => {
        return (
          <Link
            href={menu.href}
            className="duration-300 cursor-pointer"
            key={createKey()}
          >
            <div
              className={`ff-ba ff-skew min-w-[80px] flex items-center justify-center min-h-[30px] cursor-pointer px-[10px] border-dotted border border-blue-950 
                    ${path.indexOf(`${menu.href}`) >= 0 ? 'bg-green-500 text-white' : 'bg-white'}`}
            >
              {menu.name}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
