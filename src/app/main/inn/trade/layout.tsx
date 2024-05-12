'use client'

import { useRouter } from 'next/navigation'
import { translate } from '@/services/util'

enum TradeMenuCategory {
  Weapon = 'weapon',
  Misc = 'misc',
}
export default function InnTradeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const menus = Object.values(TradeMenuCategory).map((key) => {
    return { name: key, url: `/main/inn/trade/${key}` }
  })

  const goToRoute = (url: string) => {
    router.push(url)
  }

  return (
    <div>
      <div className="flex items-center">
        <div className="flex items-center py-[4px] gap-[4px]">
          {menus.map((menu) => {
            return (
              <div
                key={`trade_category_menu_${menu.name}`}
                className="ff-ba ff-skew min-w-[50px] min-h-[30px] flex items-center justify-center bg-white cursor-pointer border border-gray-600 shadow-md shadow-white/40 rounded"
                onClick={() => {
                  goToRoute(menu.url)
                }}
              >
                {translate(`menu:${menu.name}`)}
              </div>
            )
          })}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}
