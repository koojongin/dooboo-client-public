import { Chip } from '@material-tailwind/react'
import { Item } from '@/interfaces/item.interface'
import ItemBoxComponent from '@/components/item/item-box'

export function DropResultComponent({ battleResult }: { battleResult: any }) {
  return (
    <div>
      <div className="flex gap-1">
        <Chip
          color="teal"
          variant="gradient"
          size="sm"
          value={`+${battleResult.monster.experience} exp`}
        />
        <Chip
          color="yellow"
          variant="gradient"
          size="sm"
          value={`+${battleResult.monster.gold} Gold`}
        />
      </div>
      {battleResult.drops.length > 0 && (
        <DropListComponent drops={battleResult.drops} />
      )}
    </div>
  )
}
export function DropListComponent({ drops }: { drops: Item[] }) {
  return (
    <div className="flex flex-col mt-10">
      <div className="w-[250px] ff-gs text-white text-[16px] pl-1 bg-gradient-to-r from-ruliweb to-ruliweb/0 rounded-t">
        획득한 아이템
      </div>
      <div className="flex flex-row gap-1 border-ruliweb border-dashed border p-[4px]">
        {drops.map((item) => {
          return (
            <ItemBoxComponent
              item={item}
              key={`drops_${item._id}`}
              className="border p-[2px]"
            />
            // <div
            //   key={item._id}
            //   className="w-[40px] h-[40px] border-dark-blue border rounded"
            // >
            //   <img
            //     src={toAPIHostURL(item.thumbnail)}
            //     className="w-full h-full p-[2px]"
            //   />
            // </div>
          )
        })}
      </div>
    </div>
  )
}
