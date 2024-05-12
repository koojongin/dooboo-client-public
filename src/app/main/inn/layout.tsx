import InnHeader from './inn-header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col gap-[4px] text-[20px] ff-ba ff-skew w-full">
      <InnHeader />
      <div>{children}</div>
    </div>
  )
}
