'use client'

import { Card } from '@material-tailwind/react'
import createKey from '@/services/key-generator'

export default function QuestPage() {
  const quests = [
    {
      name: '인벤토리를 확장하자! - 1',
      desc: '거래 상인에게 10,000Gold를 지불하고, 인벤토리를 확장한다.',
      rewardDesc: '',
    },

    {
      name: '인벤토리를 확장하자! - 2',
      desc: '거래 상인에게 50,000Gold를 지불하고, 인벤토리를 확장한다.',
      rewardDesc: '',
    },

    {
      name: '인벤토리를 확장하자! - 3',
      desc: '거래 상인에게 100,000Gold를 지불하고, 인벤토리를 확장한다.',
      rewardDesc: '',
    },
  ]
  return (
    <div>
      <Card className="rounded p-[8px] w-full">
        거래소 개발중........
        <div className="flex flex-col gap-[2px]">
          {quests.map((quest) => {
            return (
              <div
                key={createKey()}
                className="flex gap-[2px] items-center border-b-dark-blue border-b p-[4px]"
              >
                <div className="flex flex-col gap-[4px]">
                  <div className="">{quest.name}</div>
                  <div className="text-[18px]">{quest.desc}</div>
                </div>
                <div className="ml-auto">
                  <div className="bg-green-300 text-white px-[4px] py-[2px] min-w-[60px] rounded flex items-center justify-center">
                    수락
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
