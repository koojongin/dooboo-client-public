'use client'

import { Card, CardBody } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import { ProfileBoxComponent } from '../profile-box.component'
import { ProfileCommentComponent } from '../profile-comment.component'
import { fetchGetCharacterProfile } from '@/services/api/api.character'
import { Character } from '@/interfaces/user.interface'

export default function ProfilePage({
  params,
}: {
  params: { profileId: string }
}) {
  const { profileId } = params

  // 페이지 상태 관리
  const [character, setCharacter] = useState<Character>()

  // API
  const getProfileInfo = useCallback(async (cId: string) => {
    const result = await fetchGetCharacterProfile(cId)
    setCharacter(result.character)
  }, [])

  useEffect(() => {
    getProfileInfo(profileId)
  }, [profileId, getProfileInfo])

  return (
    <div className="w-full">
      {!character && <div>Loading...</div>}
      {character && (
        <Card className="rounded w-full flex-row justify-between p-[10px] gap-[10px]">
          <ProfileBoxComponent character={character!} />
          <ProfileCommentComponent
            character={character!}
            profileId={profileId}
          />
        </Card>
      )}
    </div>
  )
}
