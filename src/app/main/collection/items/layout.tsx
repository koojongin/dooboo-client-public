'use client'

import Link from 'next/link'
import createKey from '@/services/key-generator'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="flex items-center gap-[4px] mb-[10px]">
        {[
          { name: '무기', href: '/main/collection/items/weapon' },
          { name: '방어구', href: '/main/collection/items/defence-gear' },
        ].map((menu) => {
          return (
            <Link href={menu.href} key={createKey()}>
              <div className="py-[4px] px-[10px] bg-green-500 text-white rounded shadow-md ff-score font-bold text-[20px]">
                {menu.name}
              </div>
            </Link>
          )
        })}
      </div>
      {children}
    </>
  )
}
