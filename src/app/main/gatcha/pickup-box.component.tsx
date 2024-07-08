import { CardSetCategory } from '@/constants/cards.enum'
import { translate } from '@/services/util'

export function PickUpBox({
  event,
}: {
  event: { categoryName: CardSetCategory }
}) {
  const { categoryName } = event

  const getEventNumber = () => {
    if (categoryName === CardSetCategory.All) return 0
    if (categoryName === CardSetCategory.HoshinoAndShiroko) return 1
    if (categoryName === CardSetCategory.Mashiro) return 2
    if (categoryName === CardSetCategory.Aru) return 3
    if (categoryName === CardSetCategory.ShokuhouMisaki) return 4
    if (categoryName === CardSetCategory.Wakamo) return 5
    if (categoryName === CardSetCategory.AzusaSwimsuit) return 6
    if (categoryName === CardSetCategory.FlatCardPickUp) return 7
    if (categoryName === CardSetCategory.PhysicalPickUp) return 8
    if (categoryName === CardSetCategory.FubukiPickUp) return 9
    return 0
  }

  return (
    <div className="border border-gray-600 p-[1px] rounded shadow-md shadow-dark-blue/50 hover:shadow-dark-blue cursor-pointer">
      <div className="border border-gray-600 flex flex-col p-[10px] rounded gap-[2px] border-dashed">
        <div className="ff-ba ff-skew">픽업 모집중</div>
        <div className="border-b-gray-500 border-b border-dashed my-[2px]" />
        <div className="max-w-full w-full">
          <img
            className="w-full"
            src={`/images/pickup/pickup_${`${getEventNumber()}`.padStart(3, '0')}.webp`}
          />
        </div>
      </div>
    </div>
  )
}
