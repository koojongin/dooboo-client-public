import { Card, Tooltip } from '@material-tailwind/react'
import { DropTableItem } from '@/interfaces/drop-table.interface'
import {
  BaseItemTypeKind,
  InventoryResponse,
} from '@/interfaces/item.interface'
import { BaseWeaponBoxTooltipComponent } from '@/app/main/collection/maps/base-weapon-box-tooltip.component'
import toAPIHostURL from '@/services/image-name-parser'
import { BaseMiscBoxTooltipComponent } from '@/app/main/collection/maps/base-misc-box-tooltip.component'
import { DataQueue } from '@/game/scenes/objects/GamePlayer'
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
import { GameConfig } from '@/game/scenes/enums/enum'
import createKey from '@/services/key-generator'
import { formatNumber } from '@/services/util'
import { BaseDefenceGearBoxTooltipComponent } from '@/app/main/collection/maps/base-defence-gear-box-tooltip.component'

export function PendingItem({ dropItem }: { dropItem: DropTableItem }) {
  const { iType, item } = dropItem
  const { thumbnail } = item
  return (
    <div>
      {iType === BaseItemTypeKind.BaseWeapon && (
        <Tooltip
          className="rounded-none bg-transparent"
          interactive
          placement="right"
          content={<BaseWeaponBoxTooltipComponent item={dropItem} />}
        >
          <div
            className="w-[40px] h-[40px] bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${toAPIHostURL(thumbnail)}')` }}
          />
        </Tooltip>
      )}

      {iType === BaseItemTypeKind.BaseMisc && (
        <Tooltip
          className="rounded-none bg-transparent"
          interactive
          placement="right"
          content={<BaseMiscBoxTooltipComponent item={dropItem} />}
        >
          <div
            className="w-[40px] h-[40px] bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${toAPIHostURL(thumbnail)}')` }}
          />
        </Tooltip>
      )}

      {iType === BaseItemTypeKind.BaseDefenceGear && (
        <Tooltip
          className="rounded-none bg-transparent"
          interactive
          placement="right"
          content={<BaseDefenceGearBoxTooltipComponent item={dropItem} />}
        >
          <div
            className="w-[40px] h-[40px] bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${toAPIHostURL(thumbnail)}')` }}
          />
        </Tooltip>
      )}
    </div>
  )
}

export function PendingEarnedBox({
  pendingData,
  scene,
  inventoryRes,
}: {
  pendingData?: DataQueue
  scene: FightScene
  inventoryRes?: InventoryResponse
}) {
  const {
    gold = 0,
    experience = 0,
    items = [],
    damaged = 0,
  } = pendingData || {}
  return (
    <div className="flex flex-col gap-[4px]">
      <Card className="p-[4px] rounded-none ff-score-all font-bold min-w-[140px]">
        <Tooltip
          content={
            <div>
              <div>
                획득 대기 목록은 {GameConfig.QueueResolveTime / 1000}초 주기로
                획득 후 갱신 됩니다.
              </div>
              <div className="text-red-500">
                (주의! 갱신되지 않았을때 페이지 이동시 모든 목록이 손실됩니다.)
              </div>
            </div>
          }
        >
          <div className="flex items-center cursor-pointer gap-[4px]">
            <div>획득 대기</div>
            <div className="flex items-center justify-center bg-gray-800 text-white rounded-full text-[12px] w-[16px] h-[16px]">
              <i className="fa-solid fa-question" />
            </div>
          </div>
        </Tooltip>
        <div>+{gold.toLocaleString()} gold</div>
        <div>+{experience.toLocaleString()} exp</div>
        <div>
          {inventoryRes?.isFulled && (
            <Tooltip content="인벤토리가 가득차면 더 이상 아이템을 획득할 수 없습니다.">
              <div className="text-red-500 flex items-center gap-[4px] cursor-pointer">
                <div>인벤토리 가득참</div>
                <div className="flex items-center justify-center bg-gray-800 text-white rounded-full text-[12px] w-[16px] h-[16px]">
                  <i className="fa-solid fa-question" />
                </div>
              </div>
            </Tooltip>
          )}
          {!inventoryRes?.isFulled &&
            items.map((dropItem) => (
              <PendingItem dropItem={dropItem} key={createKey()} />
            ))}
        </div>
      </Card>
      <PendingTotalDamageBox damaged={damaged} />
    </div>
  )
}

export function PendingTotalDamageBox({ damaged }: { damaged: number }) {
  return (
    <Card className="p-[4px] rounded-none ff-score-all font-bold min-w-[140px]">
      <Tooltip content="획득 갱신까지 누적된 피해량입니다.">
        <div className="flex items-center cursor-pointer gap-[4px]">
          <div>누적 피해량</div>
          <div className="flex items-center justify-center bg-gray-800 text-white rounded-full text-[12px] w-[16px] h-[16px]">
            <i className="fa-solid fa-question" />
          </div>
        </div>
      </Tooltip>
      <div>{formatNumber(damaged)}</div>
    </Card>
  )
}
