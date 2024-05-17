'use client'

import { usePathname, useRouter } from 'next/navigation'
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
    {
      name: '거래소',
      url: '/main/inn/trade/weapon',
      thumbnail: '/images/icon_trade.webp',
    },
    {
      name: '카드',
      url: '/main/inn/deck',
      thumbnail: '/images/icon_deck.webp',
    },
    {
      name: '업적',
      url: '/main/inn/archievement',
      thumbnail: '/images/icon_deck.webp',
    },
  ]
  const goToRoute = (path: string) => {
    router.push(path)
  }

  return (
    <div>
      <div className="flex gap-[2px]">
        {menus.map((menu) => {
          return (
            <div
              key={createKey()}
              className={`group w-[100px] h-[100px] relative flex items-center justify-center rounded cursor-pointer border border-4 ${pathname.indexOf(menu.url) >= 0 ? 'border-blue-800' : 'border-transparent'}`}
              onClick={() => goToRoute(menu.url)}
            >
              {menu.name === '카드' && (
                <div
                  className="w-full h-full bg-center bg-contain bg-no-repeat"
                  style={{
                    backgroundImage: `url('${menu.thumbnail}')`,
                  }}
                />
              )}
              {menu.name !== '카드' && (
                <img className="w-full h-full" src={menu.thumbnail} />
              )}
              <div className="group-hover:bg-blueGray-600 w-full ff-ba ff-skew absolute bg-gradient-to-r from-slate-400/60 via-slate-300/70 to-slate-500/90 w-full text-white bottom-0 py-[3px] flex justify-center items-center">
                {menu.name}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
