import BlackSmithHeader from '@/app/main/inn/black-smith/black-smith-header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col gap-[4px] text-[20px] ff-ba ff-skew w-full">
      <BlackSmithHeader />
      <div>{children}</div>
    </div>
  )
}
