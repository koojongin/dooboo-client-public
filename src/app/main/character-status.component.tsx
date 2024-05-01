'use client'

import { Card, CardBody, Tooltip } from '@material-tailwind/react'
import { MeResponse } from '@/interfaces/user.interface'
import { Item } from '@/interfaces/item.interface'
import toAPIHostURL from '@/services/image-name-parser'
import {
  InventoryActionKind,
  WeaponBoxDetailComponent,
} from '@/app/main/inventory.component'
import { fetchUnequipItem } from '@/services/api-fetch'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'

export default (function CharacterStatusComponent({
  user,
  character,
  nextExp,
  stat,
  equippedItems,
  refreshInventory,
  refreshMe,
}:
  | (MeResponse & {
      refreshInventory: Promise<void>
      refreshMe: Promise<void>
    })
  | any): JSX.Element {
  const unequipItem = async (item: Item) => {
    await fetchUnequipItem(item._id!)
    await Promise.all([refreshInventory(), refreshMe()])
  }

  const EXP_WIDTH = 250
  return (
    <Card className="rounded min-w-[460px] w-full flex flex-col justify-start items-start min-h-40">
      <CardBody className="w-full">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <div className="w-[80px] h-[80px] min-w-[80px] min-h-[80px] border border-gray-600 rounded p-[1px] flex items-center justify-center">
              {/* <img className="w-full" src="/images/ako.webp" /> */}
              <img className="w-full" src={DEFAULT_THUMBNAIL_URL} />
            </div>
            <div className="w-full flex flex-col gap-[2px]">
              <div className="flex w-full justify-between">
                <div>Lv.{character.level}</div>
                <div>{user.nickname}</div>
              </div>
              <div className="w-full flex justify-between">
                <div>골드</div>
                <div>{character.gold.toLocaleString()}</div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div>경험치</div>
                <div>
                  <Tooltip
                    interactive
                    content={`경험치 ${character.experience} / ${nextExp}`}
                  >
                    <div
                      className={`min-w-[${EXP_WIDTH}px] max-w-[${EXP_WIDTH}px] min-h-[26px] flex justify-center items-center relative rounded-md overflow-hidden border-2 border-blue-200 noselect cursor-pointer`}
                    >
                      {/* {character.experience}/{nextExp} */}
                      <div
                        className="absolute left-0 max-w-[300px] min-h-full opacity-80 z-20"
                        style={{
                          width: `${EXP_WIDTH * (character.experience / nextExp)}px`,
                          background:
                            'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
                          transition: 'width 1s',
                        }}
                      />
                      <div
                        className={`absolute min-w-[${EXP_WIDTH}px] max-w-[{EXP_WIDTH$px] min-h-full bg-blue-100`}
                      />
                      <div
                        className={`z-20 absolute min-w-[${EXP_WIDTH}px] max-w-[{EXP_WIDTH$px] min-h-full flex items-center justify-center text-white ff-ba text-[20px] leading-[20px]`}
                      >
                        {((character.experience / nextExp) * 100).toFixed(2)}%
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between">
            <div>물리 피해</div>
            <div>{stat.damageOfPhysical}</div>
          </div>

          <div className="w-full flex justify-between">
            <div>화염 피해</div>
            <div>{stat.damageOfFire}</div>
          </div>
          <div className="w-full flex justify-between">
            <div>냉기 피해</div>
            <div>{stat.damageOfCold}</div>
          </div>
          <div className="w-full flex justify-between">
            <div>번개 피해</div>
            <div>{stat.damageOfLightning}</div>
          </div>

          <div className="w-full flex justify-between">
            <div>치명타 확률</div>
            <div>{stat.criticalRate.toFixed(2)}%</div>
          </div>
          <div className="w-full flex justify-between">
            <div>치명타 배율</div>
            <div>+{stat.criticalMultiplier}%</div>
          </div>
          <hr className="mb-1" />
          <div>
            <div>착용장비</div>
            <div className="flex flex-col gap-1">
              {equippedItems?.length === 0 && (
                <div className="w-full min-h-[30px] border border-gray-300 rounded flex justify-center items-center">
                  착용된 장비가 없습니다.
                </div>
              )}

              {equippedItems?.length > 0 &&
                equippedItems.map((item: Item) => {
                  return (
                    <div key={`${item._id}_equipped`} className="flex gap-1">
                      <div
                        className="min-w-[30px] min-h-[30px] border border-gray-300 rounded flex justify-center items-center bg-red-300 text-white cursor-pointer"
                        onClick={() => unequipItem(item)}
                      >
                        x
                      </div>
                      <Tooltip
                        className="rounded-none bg-transparent"
                        interactive
                        content={
                          <WeaponBoxDetailComponent
                            item={item}
                            actions={[InventoryActionKind.Share]}
                          />
                        }
                      >
                        <div className="pl-[3px] w-full min-h-[30px] border border-gray-300 rounded flex justify-start items-center gap-1">
                          <img
                            src={toAPIHostURL(item.weapon.thumbnail)}
                            className="w-[24px] h-[24px] border rounded"
                          />
                          <div>{item.weapon.name}</div>
                        </div>
                      </Tooltip>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
})
