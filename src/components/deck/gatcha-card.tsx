import { Tooltip } from '@material-tailwind/react'
import createKey from '@/services/key-generator'
import { translate } from '@/services/util'
import { GatchaCard } from '@/interfaces/gatcha.interface'
import { DeckCardTooltip } from '@/components/deck/card-set-list'

export function GatchaCardComponent({
  card,
  isOwn,
  width = 100,
}: {
  card: GatchaCard
  isOwn?: boolean
  width?: number
}) {
  return (
    <Tooltip
      className="bg-black/75"
      interactive
      key={`card_frame_${card.name}`}
      content={<DeckCardTooltip card={card} />}
    >
      <div className="flex flex-col" style={{ width: `${width}px` }}>
        <div
          className={`border border-gray-300 cursor-pointer relative bg-cover bg-no-repeat bg-center ${isOwn ? '' : 'brightness-[.2]'}`}
          style={{
            width: `${width}px`,
            height: `${width}px`,
            backgroundImage: `url('${card.thumbnail}')`,
          }}
        />
        <div className="flex bg-white/90 items-center justify-center ff-ba text-[16px] h-[22px]">
          {new Array(card.starForce).fill(1).map(() => (
            <img
              key={createKey()}
              className="w-[16px] h-[16px]"
              src="/images/star_on.png"
            />
          ))}
        </div>
        <div className="flex items-center justify-center text-[16px] py-[4px] bg-blueGray-500 text-white w-full">
          <div className="ff-ba ff-skew px-[4px] overflow-ellipsis truncate">
            {translate(`card:${card.name}`)}
          </div>
        </div>
      </div>
    </Tooltip>
  )
}
