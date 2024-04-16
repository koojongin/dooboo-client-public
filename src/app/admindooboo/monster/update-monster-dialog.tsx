import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react'
import { Monster, UpdateMonsterDialogRef } from '@/interfaces/monster.interface'
import UpdateMonsterForm from '@/app/admindooboo/monster/update-monster'

function UpdateMonsterDialog(
  { refreshMonsters }: any,
  ref: ForwardedRef<UpdateMonsterDialogRef>,
) {
  const [open, setOpen] = useState(false)
  const [monster, setMonster] = useState<Monster>()

  const handleOpen = () => {
    setOpen(!open)
  }

  const handleClose = (needRefresh: boolean) => {
    setOpen(false)
    if (needRefresh) refreshMonsters()
  }

  useImperativeHandle(ref, () => ({
    openDialog: (selectedMonster: Monster) => {
      setMonster(selectedMonster!)
      handleOpen()
    },
  }))

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogBody className="h-[42rem] overflow-scroll">
        <UpdateMonsterForm
          selectedMonster={monster!}
          handleClose={handleClose}
        />
      </DialogBody>
    </Dialog>
  )
}
export default forwardRef<any, any>(UpdateMonsterDialog)
