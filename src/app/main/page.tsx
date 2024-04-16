'use client'

import React, { useEffect, useRef, useState } from 'react'
import api from '@/services/api'
import Battle from '@/components/battle/battle.component'
import CharacterStatusComponent from '@/app/main/character-status.component'
import {
  Character,
  CharacterStat,
  MeResponse,
  User,
} from '@/interfaces/user.interface'
import InventoryComponent from '@/app/main/inventory.component'
import ProfileComponent from '@/app/main/profile'
import { fetchMe } from '@/services/api-fetch'

export default function Main() {
  // const [onLoading, setOnLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [character, setCharacter] = useState<Character | null>(null)
  const [nextExp, setNextExp] = useState<number>(0)
  const [stat, setStat] = useState<CharacterStat>()

  const refreshMe = async () => {
    const {
      nextExp: rNextExp,
      user: dUser,
      character: dCharacter,
      stat: rStat,
    } = await fetchMe()
    setUser(dUser)
    setCharacter(dCharacter)
    setNextExp(rNextExp)
    setStat(rStat)
  }

  const battleHandler = {
    refreshCharacterComponent: async () => {
      await refreshMe()
    },
  }

  useEffect(() => {
    refreshMe()
  }, [])

  return (
    user && (
      <div className="">
        <div className="items-center flex flex-col w-full mb-40">
          <div className="w-full min-h-80 grid grid-cols-8 justify-center items-center mb-2">
            <Battle headCss="col-span-8 h-full" battleHandler={battleHandler} />
          </div>
          <div className="justify-between w-full grid grid-cols-3 gap-1">
            <ProfileComponent />
            <CharacterStatusComponent
              character={character!}
              user={user}
              nextExp={nextExp}
              stat={stat}
            />
            <InventoryComponent />
          </div>
        </div>
      </div>
    )
  )
}
