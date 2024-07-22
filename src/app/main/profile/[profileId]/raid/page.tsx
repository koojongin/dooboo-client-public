'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card } from '@material-tailwind/react'
import _ from 'lodash'
import { fetchGetCharacterRaidById } from '@/services/api/api.raid'
import { CharacterRaid } from '@/interfaces/raid.interface'
import createKey from '@/services/key-generator'
import { formatNumber } from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'

export default function ProfileRaidPage({
  params,
}: {
  params: { profileId: string }
}) {
  const [characterRaid, setCharacterRaid] = useState<CharacterRaid>()
  const loadCharacterRaid = useCallback(async () => {
    const result = await fetchGetCharacterRaidById(params.profileId)
    setCharacterRaid({ ...result.characterRaid })
  }, [params.profileId])

  const sortedMapIds = () => {
    if (!characterRaid) return []
    const damageLogs = Object.values(characterRaid.logs)
    return _.sortBy(damageLogs, 'map.level')
  }

  useEffect(() => {
    loadCharacterRaid()
  }, [loadCharacterRaid])
  return (
    <Card className="rounded p-[10px]">
      <div className="text-[20px]">레이드 기록</div>
      {characterRaid && (
        <div className="flex flex-col gap-[4px]">
          {sortedMapIds().map((damageLog) => {
            const { map } = damageLog
            const boss = (map.monsters || [])[0]!
            return (
              <div
                key={createKey()}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className="bg-contain w-[50px] h-[50px]"
                    style={{
                      backgroundImage: `url(${toAPIHostURL(boss?.thumbnail)})`,
                    }}
                  />
                  <div className="p-[5px]">{map.name}</div>
                </div>
                <div className="p-[5px]">{formatNumber(damageLog.damage)}</div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
