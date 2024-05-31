'use client'

import _ from 'lodash'
import { useState } from 'react'
import createKey from '@/services/key-generator'
import { translate } from '@/services/util'
import { GatchaCard } from '@/interfaces/gatcha.interface'

export function GatchaRateBoxComponent({ cardSet }: { cardSet: any[] }) {
  const [selectedCard, setSelectedCard] = useState()
  const getColorByStarForce = (starForce: number) => {
    if (starForce === 3) return 'rgba(255,135,234,0.31)'
    if (starForce === 2) return 'rgba(255,237,128,0.4)'
    if (starForce === 1) return 'rgba(255,254,254,0.23)'
  }

  const showDetailCardInfo = (card: any) => {
    setSelectedCard(card)
  }

  return (
    <>
      <div>
        <div>3성 - 1%</div>
        <div>2성 - 5%</div>
        <div>1성 - 94%</div>
        <div className="">
          <div>등장수치</div>
          <div>
            예시) 1% 확률로 3성이 걸렸을때, 3성 목록내에서 해당 등장수치로
            주사위를 다시 굴립니다.
          </div>
          <div>
            등장수치가 마시로(1), 호시노(1), 시로코(2) 라고 가정한다면, 4면체
            주사위에 2개가 시로코이고, 마시로와 호시노는 각 1개의 면을
            차지합니다.
          </div>
        </div>
      </div>
      <div className="flex">
        <div>
          <div className="flex gap-[4px] bg-gray-800 text-white py-[4px]">
            <div className="w-[20px]" />
            <div className="w-[230px]">카드</div>
            <div className="w-[80px]">스타포스</div>
            <div className="w-[80px]">등장수치</div>
          </div>
          <div>
            {_.sortBy(cardSet, 'starForce')
              .reverse()
              .map((card, index) => {
                return (
                  <div
                    key={createKey()}
                    className="flex items-center gap-[4px] border-b border-b-gray-300 border-dashed py-[2px] cursor-pointer"
                    onClick={() => showDetailCardInfo(card)}
                    style={{
                      background: getColorByStarForce(card.starForce),
                    }}
                  >
                    <div className="w-[20px] text-center">{index + 1}</div>
                    <div
                      className="w-[30px] h-[30px] bg-cover bg-center p-[2px] border border-gray-600 rounded bg-origin-content"
                      style={{ backgroundImage: `url(${card.thumbnail})` }}
                    />
                    <div className="min-w-[200px]">
                      {translate(`card:${card.name}`)}
                    </div>
                    <div className="min-w-[80px]">
                      <div className="flex">
                        {new Array(card.starForce).fill(1).map(() => (
                          <img
                            key={createKey()}
                            className="w-[16px] h-[16px]"
                            src="/images/star_on.png"
                          />
                        ))}
                      </div>
                    </div>
                    <div>{card.weight}</div>
                  </div>
                )
              })}
          </div>
        </div>
        <div className="border border-gray-300 min-w-[400px]">
          {!selectedCard && (
            <div className="flex items-center justify-center">카드 설명...</div>
          )}
          {selectedCard && <CardBox card={selectedCard} />}
        </div>
      </div>
    </>
  )
}

function CardBox({ card }: { card: GatchaCard }) {
  return (
    <div className="">
      <div className="p-[10px] flex gap-[10px] items-center bg-gray-200/50 border-b border-b-gray-300">
        <div className="border border-gray-600 rounded p-[1px] shadow-md shadow-gray-500">
          <div
            className="w-[80px] h-[80px] bg-cover bg-center p-[2px] border border-gray-600 rounded bg-origin-content"
            style={{ backgroundImage: `url(${card.thumbnail})` }}
          />
        </div>
        <div className="ff-ba text-[24px]">
          {translate(`card:${card.name}`)}
        </div>
      </div>
      <div className="p-[10px]">
        {card.options.map((option) => {
          return (
            <div key={`${card.name}_${option.name}`} className="flex flex-col">
              <div className="flex items-center justify-between">
                <div>{translate(`card:option:${option.name}`)}</div>
                <div>{option.value}</div>
              </div>
              <div>
                <div className="break-all">{option.desc}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
