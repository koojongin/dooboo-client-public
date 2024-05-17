'use client'

import { useRouter } from 'next/navigation'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  return (
    <div className="w-full">
      <div className="flex items-center">
        <div
          className="bg-blueGray-600 text-white cursor-pointer flex items-center justify-center w-[80px] h-[30px]"
          onClick={() => router.back()}
        >
          뒤로가기
        </div>
      </div>
      <div className="mt-[5px] w-full">{children}</div>
    </div>
  )
}
