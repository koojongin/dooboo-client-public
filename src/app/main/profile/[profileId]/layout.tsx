import { ProfileLeftBoxComponent } from '@/app/main/profile/profile-left-box.component'
import { ProfileCommentComponent } from '@/app/main/profile/profile-comment.component'
import { ProfileSearchBar } from '@/app/main/profile/profile-search-bar'

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: { profileId: string }
}>) {
  const currentPath = ''
  return (
    <div className="flex flex-col gap-[4px]">
      <ProfileSearchBar />
      <div className="w-full flex items-start gap-[5px]">
        <ProfileLeftBoxComponent characterId={params.profileId} />
        <div className="w-full flex flex-col gap-[5px]">
          <div>{children}</div>
          <ProfileCommentComponent profileId={params.profileId} />
        </div>
      </div>
    </div>
  )
}
