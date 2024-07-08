import { useEffect, useState } from 'react'
import { Tooltip } from '@material-tailwind/react'
import { Item, ItemTypeKind } from '@/interfaces/item.interface'
import { toColorByGrade } from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'

export function DivideItemDialogComponent({
  item,
  setAmount,
}: {
  item: Item
  setAmount: (value: number) => void
}) {
  const [value, setValue] = useState<number>(1)

  useEffect(() => {
    setAmount(value)
  }, [setAmount, value])
  return (
    <div>
      <>
        <div className="flex items-center justify-center">
          <div className="bg-gray-400 flex items-center gap-[5px] p-[10px]">
            <img
              className="w-[40px] h-[40px] border-2 p-[2px] rounded bg-gray-200 shadow-md shadow-gray-400"
              style={{
                borderColor: toColorByGrade(item.misc.baseMisc.iGrade),
              }}
              src={toAPIHostURL(item.misc.baseMisc.thumbnail)}
            />
            <div className="ff-wavve text-white min-w-[150px]">
              {item.misc.baseMisc.name}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start text-[14px] mt-[15px]">
          <div className="flex items-center gap-[10px]">
            <i className="text-[4px] fa-solid fa-circle" />
            <div>나눌 갯수는 현재 스택보다 작아야합니다.</div>
          </div>
          <div className="flex items-center gap-[10px]">
            <i className="text-[4px] fa-solid fa-circle" />
            <div>나눌 갯수는 1개 이상이어야 합니다.</div>
          </div>
          <div className="flex items-stretch gap-[2px] border border-gray-500 border-dashed ff-score-all font-bold">
            <div className="ff-skew text-[16px] p-[4px]">중첩된 수량</div>
            <div className="flex items-center justify-center ff-skew border border-gray-600 bg-gray-600 text-white p-[4px] py-[2px] text-[14px] w-[50px]">
              {item.misc.stack}
            </div>
          </div>
        </div>
      </>
    </div>
  )
}
