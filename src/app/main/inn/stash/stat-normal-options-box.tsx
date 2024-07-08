import { Tooltip } from '@material-tailwind/react'
import { CharacterStat } from '@/interfaces/user.interface'
import { formatNumber } from '@/services/util'

export function StatNormalOptionsBox({ stat }: { stat: CharacterStat }) {
  return (
    <div className="flex flex-col gap-[2px]">
      <div className="w-full flex flex-col justify-between">
        <div className="flex justify-between">
          <Tooltip content="HP증가(%) 옵션은 추가된 HP에 대해서만 계산합니다.">
            <div className="flex items-center cursor-pointer gap-[2px]">
              HP
              <i className="fa-regular fa-circle-question" />
            </div>
          </Tooltip>
          <div>{stat.hp}</div>
        </div>
        {stat.addedHp > 0 && (
          <div className="flex items-center gap-[2px] justify-between">
            <i className="fa-solid fa-turn-up rotate-90" />
            <div>
              {stat.hp - stat.addedHp}(+{stat.addedHp})
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex justify-between">
        <div>MP</div>
        <div>{stat.mp}</div>
      </div>
      <div className="w-full flex justify-between">
        <div>방어력</div>
        <div>{formatNumber(stat.armor)}</div>
      </div>
      <div className="w-full flex justify-between">
        <div>초당 HP 회복</div>
        <div>{stat.hpRegenerate}</div>
      </div>
      <div className="w-full flex justify-between">
        <div>초당 MP 회복</div>
        <div>{stat.mpRegenerate}</div>
      </div>

      <div className="w-full flex justify-between">
        <div>힘</div>
        <div>+{formatNumber(stat.str)}</div>
      </div>
      <div className="w-full flex justify-between">
        <div>민첩</div>
        <div>+{formatNumber(stat.dex)}</div>
      </div>
      <div className="w-full flex justify-between">
        <div>행운</div>
        <div>+{formatNumber(stat.luk)}</div>
      </div>
    </div>
  )
}
