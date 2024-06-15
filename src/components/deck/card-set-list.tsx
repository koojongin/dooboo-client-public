import { Tooltip } from '@material-tailwind/react'
import _ from 'lodash'
import { translate } from '@/services/util'
import createKey from '@/services/key-generator'
import { GatchaCardExtended } from '@/app/main/inn/deck/deck.type'
import { BA_COLOR } from '@/constants/constant'

export function CardSetList({
  allCardSet,
}: {
  allCardSet: GatchaCardExtended[]
}) {
  return (
    <>
      {_.sortBy(allCardSet, 'starForce')
        .reverse()
        .map((card) => {
          return (
            <Tooltip
              className="bg-black/75"
              interactive
              key={`card_frame_${card.name}`}
              content={
                <div className="flex flex-col items-start">
                  <div
                    className={`ff-wavve text-[20px] text-white flex bg-[${BA_COLOR}] p-[4px] rounded mb-[4px] border border-white`}
                  >
                    {translate(`card:${card.name}`)}
                  </div>
                  {card.options.map((option) => {
                    return (
                      <div key={createKey()} className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <div>{translate(`card:option:${option.name}`)}</div>
                          <div className="ml-[10px]">{option.value}</div>
                        </div>
                        {option.desc && (
                          <div className="flex items-center gap-[5px]">
                            <i className="ml-[10px] fa-solid fa-turn-up rotate-90" />
                            <div>{option.desc}</div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              }
            >
              <div className="p-[1px] border border-gray-500 shadow-md shadow-gray-400 cursor-pointer">
                <div className="flex flex-col border border-gray-300 max-w-[60px] items-center">
                  <div
                    className={`relative w-[60px] h-[60px] bg-cover bg-no-repeat bg-center ${(card.stack || 0) > 0 ? '' : 'brightness-[.2]'}`}
                    style={{
                      backgroundImage: `url('${card.thumbnail}')`,
                    }}
                  >
                    {(card.stack || 0) > 0 && (
                      <div className="absolute bg-white/85 text-gray-800 ff-ba text-[16px] border border-gray-600 px-[3px] flex items-center justify-center">
                        x{card.stack}
                      </div>
                    )}
                  </div>
                  <div className="flex bg-white/90 items-center justify-center ff-ba text-[16px] h-[22px]">
                    {new Array(card.starForce).fill(1).map(() => (
                      <img
                        key={createKey()}
                        className="w-[16px] h-[16px]"
                        src="/images/star_on.png"
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-center py-[4px] bg-blueGray-500 text-white w-full">
                    <div className="overflow-ellipsis truncate max-w-full px-[6px] text-[14px] ff-ba ff-skew">
                      {translate(`card:${card.name}`)}
                    </div>
                  </div>
                </div>
              </div>
            </Tooltip>
          )
        })}
    </>
  )
}
