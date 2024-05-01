import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react'
import { Dialog, DialogBody, Tooltip } from '@material-tailwind/react'
import { BaseWeapon, SelectItemDialogRef } from '@/interfaces/item.interface'
import { fetchGetBaseWeaponList } from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'

function SelectItemDialog(
  { onSelectItem }: any,
  ref: ForwardedRef<SelectItemDialogRef>,
) {
  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [open, setOpen] = useState(false)
  const [baseWeapons, setBaseWeapons] = useState<BaseWeapon[]>([])

  const loadBaseWeapons = async () => {
    const { weapons } = await fetchGetBaseWeaponList()
    setBaseWeapons(weapons)
  }
  const handleOpen = async () => {
    setOpen(!open)
    await loadBaseWeapons()
  }
  const selectItem = (item: BaseWeapon | any) => {
    setOpen(false)
    onSelectItem(item, selectedIndex)
  }
  useImperativeHandle(ref, () => ({
    openDialog: (index: number) => {
      setSelectedIndex(index)
      handleOpen()
    },
  }))

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogBody className="h-[42rem] overflow-y-scroll">
        <div>아이템 목록 - 클릭시 선택됩니다.</div>
        <div className="flex flex-wrap gap-1">
          {baseWeapons.map((baseWeapon) => {
            return (
              <div
                key={baseWeapon._id}
                className="cursor-pointer"
                onClick={() => selectItem(baseWeapon)}
              >
                <Tooltip interactive content={<div>{baseWeapon.name}</div>}>
                  <div className="max-w-[36px] w-[36px] h-[36px] p-[2px] border border-dark-blue">
                    <img
                      className="w-full h-full"
                      src={toAPIHostURL(baseWeapon.thumbnail)}
                    />
                  </div>
                </Tooltip>
              </div>
            )
          })}
        </div>
        {/* <div className="flex flex-row justify-center items-center gap-1"> */}
        {/*  <div className="cursor-pointer rounded bg-green-500 text-white flex items-center justify-center py-0.5 px-[10px]"> */}
        {/*    선택 */}
        {/*  </div> */}
        {/*  <div className="cursor-pointer rounded bg-red-700 text-white flex items-center justify-center py-0.5 px-[10px]"> */}
        {/*    취소 */}
        {/*  </div> */}
        {/* </div> */}
      </DialogBody>
    </Dialog>
  )
}
export default forwardRef<any, any>(SelectItemDialog)
