'use client'

import React, { useEffect, useRef, useState } from 'react'
import { IoProvider } from 'socket.io-react-hook'
import { useRouter } from 'next/navigation'
import Battle from '@/components/battle/battle.component'
import CharacterStatusComponent from '@/app/main/character-status.component'
import { Character, CharacterStat, User } from '@/interfaces/user.interface'
import InventoryComponent from '@/app/main/inventory.component'
import { fetchMe } from '@/services/api-fetch'
import { InventoryRef, Item } from '@/interfaces/item.interface'

export default function Main() {
  // const [onLoading, setOnLoading] = useState(false)
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [character, setCharacter] = useState<Character | null>(null)
  const [nextExp, setNextExp] = useState<number>(0)
  const [stat, setStat] = useState<CharacterStat>()
  const [equippedItems, setEquippedItems] = useState<Item[]>([])

  const inventoryRef = useRef<InventoryRef>(null)

  const refreshMe = async () => {
    try {
      const {
        nextExp: rNextExp,
        user: dUser,
        character: dCharacter,
        stat: rStat,
        equippedItems: rEquippedItems,
      } = await fetchMe()

      localStorage.setItem('characterId', dCharacter._id!)
      setUser(dUser)
      setCharacter(dCharacter)
      setNextExp(rNextExp)
      setStat(rStat)
      setEquippedItems(rEquippedItems)
    } catch (error: any) {
      const { response } = error || {}
      const { data } = response || {}
      if (data?.message === 'NotFoundCharacter') {
        // localStorage.removeItem('token')
        const token = localStorage.getItem('token')
        router.push(`/register?accessToken=${token}`)
      }
    }
  }

  const battleHandler = {
    refreshCharacterComponent: async () => {
      await refreshMe()
    },
  }

  const refreshInventory = () => {
    inventoryRef?.current?.refresh()
  }
  useEffect(() => {
    refreshMe()
  }, [])

  return (
    <div className="w-full">
      <div className="items-center flex flex-col w-full">
        <div className="w-full min-h-80 grid grid-cols-8 justify-center items-center mb-2">
          {user && (
            <Battle
              headCss="col-span-8 h-full rounded w-full"
              battleHandler={battleHandler}
              refreshInventory={refreshInventory}
            />
          )}
        </div>
        <div className="justify-between w-full flex gap-1">
          {user && (
            <CharacterStatusComponent
              character={character!}
              user={user}
              nextExp={nextExp}
              stat={stat}
              equippedItems={equippedItems}
              refreshInventory={refreshInventory}
              refreshMe={refreshMe}
            />
          )}
          {user && (
            <InventoryComponent
              ref={inventoryRef}
              refreshInventory={refreshInventory}
              refreshMe={refreshMe}
              equippedItems={equippedItems}
            />
          )}
        </div>
      </div>
    </div>
  )
}
