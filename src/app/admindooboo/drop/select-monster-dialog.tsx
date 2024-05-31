import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react'
import { Dialog, DialogBody, Tooltip } from '@material-tailwind/react'
import { SelectItemDialogRef } from '@/interfaces/item.interface'
import toAPIHostURL from '@/services/image-name-parser'
import { Monster } from '@/interfaces/monster.interface'
import { fetchGetMonsters } from '@/services/api-admin-fetch'

function SelectMonsterDialog(
  { onSelectMonster }: any,
  ref: ForwardedRef<SelectItemDialogRef>,
) {
  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [open, setOpen] = useState(false)
  const [monsters, setMonsters] = useState<Monster[]>([])

  const loadMonsters = async () => {
    const { monsters: rMonsters } = await fetchGetMonsters()
    setMonsters(rMonsters)
  }
  const handleOpen = async () => {
    setOpen(!open)
    await loadMonsters()
  }
  const selectItem = (item: Monster | any) => {
    setOpen(false)
    onSelectMonster(item)
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
        <div>몬스터 목록 - 클릭시 선택됩니다.</div>
        <div className="flex flex-wrap gap-1">
          {monsters.map((monster) => {
            return (
              <div
                key={monster._id}
                className="cursor-pointer"
                onClick={() => selectItem(monster)}
              >
                <Tooltip interactive content={<div>{monster.name}</div>}>
                  <div className="max-w-[50px]">
                    <img src={toAPIHostURL(monster.thumbnail)} />
                  </div>
                </Tooltip>
              </div>
            )
          })}
        </div>
      </DialogBody>
    </Dialog>
  )
}
export default forwardRef<any, any>(SelectMonsterDialog)
