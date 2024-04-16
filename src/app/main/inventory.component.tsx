import { Card, CardBody } from '@material-tailwind/react'
import createKey from '@/services/key-generator'

export default function InventoryComponent({ borderStyle }: any) {
  return (
    <Card
      className={`col-span-1 flex justify-center items-center min-h-40 ${borderStyle}`}
    >
      <CardBody>
        <div>인벤토리</div>
        <div className="flex flex-wrap">
          {new Array(100).fill(1).map(() => {
            return (
              <div
                key={createKey()}
                className="flex border-[1px] border-r-2 rounded-md min-w-10 max-w-10 p-1"
              >
                {/*<img src="/images/sword.png" />*/}
                <img src="http://dooboo.online:3001/public/upload/items/08521e812a40a8af.png" />
              </div>
            )
          })}
        </div>
      </CardBody>
    </Card>
  )
}
