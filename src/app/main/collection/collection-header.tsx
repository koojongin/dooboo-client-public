'use client'

import { usePathname, useRouter } from 'next/navigation'
import createKey from '@/services/key-generator'

export default function CollectionHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const menus = [
    {
      name: '지역',
      url: '/main/collection/maps',
      thumbnail: '/images/icon_portal.webp',
    },
    {
      name: '아이템',
      url: '/main/collection/items',
      thumbnail: '/images/icon_items.webp',
    },
    {
      name: '등급 정보',
      url: '/main/collection/grade-info?iType=weapon',
      thumbnail: '/images/icon_items.webp',
    },
  ]

  const goToRoute = (path: string) => {
    router.push(path)
  }
  return (
    <div className="flex gap-[2px]">
      {menus.map((menu) => {
        return (
          <div
            key={createKey()}
            onClick={() => goToRoute(menu.url)}
            className={`w-[100px] h-[100px] relative flex items-center justify-center rounded cursor-pointer border border-4 ${pathname.indexOf(menu.url) >= 0 ? 'border-blue-800' : 'border-transparent'}`}
          >
            <img className="" src={menu.thumbnail} />
            <div className="absolute bg-gradient-to-b from-yellow-900 w-full text-white bottom-0 py-[3px] flex justify-center items-center">
              {menu.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}
