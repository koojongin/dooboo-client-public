'use client'
import { Card, CardBody } from '@material-tailwind/react'
import { ProfileBoxComponent } from '../profile-box.component'
import { ProfileCommentComponent } from '../profile-comment.component'
import { useEffect, useState } from 'react'

interface IUser {
  nickname: string
}

interface ICharacter {
  nickname: string
  level: string
  job: string
}

export default function ProfilePage({
  params,
}: {
  params: { characterId: string }
}) {
  const { characterId } = params

  // 페이지 상태 관리
  const [user, setUser] = useState<IUser | null>(null)
  const [character, setCharacter] = useState<ICharacter | null>(null)

  // API
  const getProfileInfo = async () => {
    const dummyData = {
      user: { nickname: '시나모롤' },
      character: { nickname: '시나모롤', level: '99', job: 'bowman' },
    }

    setUser(dummyData.user)
    setCharacter(dummyData.character)

    // try {
    //   const {
    //     nextExp: rNextExp,
    //     user: dUser,
    //     character: dCharacter,
    //     stat: rStat,
    //     equippedItems: rEquippedItems,
    //   } = await fetchMe()

    //   setUser(dUser)
    //   setCharacter(dCharacter)
    //   setNextExp(rNextExp)
    //   setStat(rStat)
    //   setEquippedItems(rEquippedItems)
    // } catch (error: any) {
    //   console.log(error)
    // }
  }

  useEffect(() => {
    getProfileInfo()
  }, [])

  return (
    <div className="w-full">
      <Card className="rounded w-full ">
        <CardBody className="flex justify-between">
          {user && <ProfileBoxComponent character={character!} user={user} />}

          <ProfileCommentComponent />
        </CardBody>
      </Card>
    </div>
  )
}
