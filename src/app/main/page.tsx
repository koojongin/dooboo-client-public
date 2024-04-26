'use client'

import React, { useEffect, useRef, useState } from 'react'
import { IoProvider } from 'socket.io-react-hook'
import Battle from '@/components/battle/battle.component'
import CharacterStatusComponent from '@/app/main/character-status.component'
import { Character, CharacterStat, User } from '@/interfaces/user.interface'
import InventoryComponent from '@/app/main/inventory.component'
import { fetchMe } from '@/services/api-fetch'
import { InventoryRef, Item } from '@/interfaces/item.interface'

export default function Main() {
  // const [onLoading, setOnLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [character, setCharacter] = useState<Character | null>(null)
  const [nextExp, setNextExp] = useState<number>(0)
  const [stat, setStat] = useState<CharacterStat>()
  const [equippedItems, setEquippedItems] = useState<Item[]>([])

  const inventoryRef = useRef<InventoryRef>(null)

  const refreshMe = async () => {
    const {
      nextExp: rNextExp,
      user: dUser,
      character: dCharacter,
      stat: rStat,
      equippedItems: rEquippedItems,
    } = await fetchMe()
    setUser(dUser)
    setCharacter(dCharacter)
    setNextExp(rNextExp)
    setStat(rStat)
    setEquippedItems(rEquippedItems)
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
    <IoProvider>
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
              />
            )}
          </div>
        </div>
      </div>
    </IoProvider>
  )
}
