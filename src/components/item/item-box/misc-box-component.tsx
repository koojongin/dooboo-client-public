import { Tooltip } from '@material-tailwind/react'
import { toColorByGrade } from '@/services/util'
import MiscBoxDetailComponent from '@/components/item/item-box/misc-box-detail.component'
import { MiscStackChip } from '@/components/chat/share-item-box.component'
import toAPIHostURL from '@/services/image-name-parser'
import { InnItem } from '@/interfaces/item.interface'

export function MiscBoxComponent({
  item,
  onClickItem,
  className,
  actions,
  itemBoxActionCallback,
}: {
  item: InnItem | any
  onClickItem: (event: React.MouseEvent) => void
  className?: string
  actions?: string[]
  itemBoxActionCallback: (type: string | any) => void
}) {
  const selectedItem = item[item.iType]
  return (
    <div
      className={`overflow-hidden relative cursor-pointer min-w-[50px] w-[50px] h-[50px] max-w-[50px] max-h-[50px] ${className}`}
      style={{
        borderColor: toColorByGrade(selectedItem?.baseMisc.iGrade),
        borderWidth: '2px',
        borderRadius: '4px',
      }}
      onClick={(e) => onClickItem(e)}
    >
      <Tooltip
        className="rounded-none bg-transparent"
        interactive
        content={
          <div>
            <MiscBoxDetailComponent
              item={item}
              actions={actions}
              actionCallback={itemBoxActionCallback}
            />
          </div>
        }
      >
        <div className="relative max-w-full max-h-full w-[50px] h-[50px]">
          <MiscStackChip stack={selectedItem?.stack} />
          <div
            className="max-w-full max-h-full w-[50px] h-[50px] bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${toAPIHostURL(selectedItem?.baseMisc?.thumbnail)})`,
            }}
          />
        </div>
      </Tooltip>
    </div>
  )
}
