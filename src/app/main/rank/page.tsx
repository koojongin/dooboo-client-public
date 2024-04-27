'use client'

import { useEffect, useState } from 'react'
import { Tooltip } from '@material-tailwind/react'
import { fetchGetRankList } from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'
import { getItemByType } from '@/services/util'
import { WeaponBoxDetailComponent } from '@/app/main/inventory.component'

export default function CommunityPage() {
  const [characters, setCharacters] = useState<any[]>([])

  const tableClass = [
    'min-w-[50px] text-center',
    'min-w-[50px] text-center',
    'min-w-[100px] ',
  ]

  const loadRanks = async () => {
    const { characters: rCharacters } = await fetchGetRankList()
    setCharacters(rCharacters)
  }
  useEffect(() => {
    loadRanks()
  }, [])
  return (
    <div className="min-w-[900px] wide:w-full">
      <div className="flex gap-1 px-[1px] py-[1px] bg-blue-gray-200 bg-dark-blue text-white">
        <div className={tableClass[0]}>랭크</div>
        <div className={tableClass[1]}>레벨</div>
        <div className={tableClass[2]}>캐릭터명</div>
        <div className="">장비</div>
      </div>
      {characters &&
        characters.map((character, index) => {
          const { user } = character
          let totalFlatDamage = 0
          let selectedItem = null
          if (character.equip) {
            selectedItem = getItemByType(character.equip)
            totalFlatDamage =
              selectedItem.damageOfPhysical +
              selectedItem.damageOfLightning +
              selectedItem.damageOfCold +
              selectedItem.damageOfFire
          }

          return (
            <div
              key={character._id}
              className="flex gap-1 px-[1px] py-[1px] items-center min-h-[30px] border-blue-gray-50 border-b"
            >
              <div className={tableClass[0]}>{index + 1}</div>
              <div className={tableClass[1]}>{character.level}</div>
              <div className={tableClass[2]}>{user.nickname}</div>
              {character.equip && (
                <div>
                  <Tooltip
                    className="rounded-none bg-transparent"
                    interactive
                    content={
                      <WeaponBoxDetailComponent
                        item={character.equip}
                        onShowActions={false}
                      />
                    }
                  >
                    <div>
                      <div className="absolute text-[12px] p-[2px]">
                        {totalFlatDamage}
                      </div>
                      <img
                        className="w-[40px] h-[40px] p-[2px] border rounded"
                        src={toAPIHostURL(selectedItem?.thumbnail || '')}
                      />
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}
