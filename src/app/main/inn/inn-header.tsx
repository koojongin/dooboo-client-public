'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import createKey from '@/services/key-generator'

export default function InnHeader() {
  const pathname = usePathname()
  const router = useRouter()

  const menus = [
    {
      name: '보관함',
      url: '/main/inn/stash',
      thumbnail: '/images/icon_stash.webp',
    },
    {
      name: '대장장이',
      url: '/main/inn/black-smith',
      thumbnail: '/images/icon_black_smith.webp',
    },
    {
      name: '상점',
      url: '/main/inn/shop',
      thumbnail: '/images/icon_shop.png',
    },
    {
      name: '퀘스트',
      url: '/main/inn/quest',
      thumbnail: '/images/icon_quest.webp',
    },
  ]
  const goToRoute = (path: string) => {
    router.push(path)
  }

  useEffect(() => {
    console.log(pathname)
  }, [pathname])

  return (
    <div>
      <div className="flex gap-[2px]">
        {menus.map((menu) => {
          return (
            <div
              key={createKey()}
              className={`w-[100px] h-[100px] relative flex items-center justify-center rounded cursor-pointer border border-4 ${pathname.indexOf(menu.url) >= 0 ? 'border-blue-800' : 'border-transparent'}`}
              onClick={() => goToRoute(menu.url)}
            >
              <img className="w-full h-full" src={menu.thumbnail} />
              <div className="absolute rounded bg-gradient-to-b from-yellow-900 w-full text-white bottom-0 py-[3px] flex justify-center items-center">
                {menu.name}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
