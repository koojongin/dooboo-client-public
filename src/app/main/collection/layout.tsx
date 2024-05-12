import type { Metadata } from 'next'
import CollectionHeader from '@/app/main/collection/collection-header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col gap-[4px] text-[20px] ff-ba ff-skew w-full">
      <CollectionHeader />
      <div>{children}</div>
    </div>
  )
}
