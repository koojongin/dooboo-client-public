import type { Metadata } from 'next'
import CommunityHeader from './header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <CommunityHeader>{children}</CommunityHeader>
}
