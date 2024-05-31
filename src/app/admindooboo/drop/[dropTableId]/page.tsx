'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Button, Card, CardBody, Tooltip } from '@material-tailwind/react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import _ from 'lodash'
import {
  BaseMisc,
  BaseWeapon,
  SelectItemDialogRef,
  SelectMonsterDialogRef,
} from '@/interfaces/item.interface'
import {
  fetchCreateDropTable,
  fetchGetDropTable,
  fetchPutDropTable,
} from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'
import createKey from '@/services/key-generator'
import SelectItemDialog from '@/app/admindooboo/drop/select-item-dialog'
import SelectMonsterDialog from '@/app/admindooboo/drop/select-monster-dialog'
import { Monster } from '@/interfaces/monster.interface'
import { toYYYYMMDDHHMMSS } from '@/services/util'
import { DropTable } from '@/interfaces/drop-table.interface'

function DropTableMonsterComponent({
  dropTable,
  setDropTable,
}: {
  dropTable: DropTable
  setDropTable: Dispatch<SetStateAction<DropTable | undefined>>
}) {
  const selectItemDialogRef = useRef<SelectItemDialogRef>(null)
  const selectMonsterDialogRef = useRef<SelectMonsterDialogRef>(null)

  const getItemType = (iType: string) => {
    if (iType === 'weapon') return 'BaseWeapon'
    if (iType === 'misc') return 'BaseMisc'
    throw new Error('UnknownType')
  }
  const onSelectItem = (item: BaseWeapon | BaseMisc, selectedIndex: number) => {
    // if (item.iType === 'weapon') {
    // }
    const newDropTable = { ...dropTable }
    newDropTable.items[selectedIndex].iType = getItemType(item.iType)
    newDropTable.items[selectedIndex].itemId = item._id
    newDropTable.items[selectedIndex].item = {
      ...newDropTable.items[selectedIndex].item,
      ...item,
    }
    setDropTable({ ...newDropTable })
  }

  const onSelectMonster = (monster: Monster) => {
    const newDropTable = { ...dropTable }
    newDropTable.monster = monster
    newDropTable.monsterId = monster._id!
    setDropTable({ ...newDropTable })
  }
  const openSelectDropItemModal = (index: number) => {
    selectItemDialogRef?.current?.openDialog(index)
  }

  const openSelectMonsterModal = () => {
    selectMonsterDialogRef?.current?.openDialog()
  }
  const removeItem = (index: number) => {
    const newDropTable: any = { ...dropTable }
    if (!newDropTable?.items) return
    newDropTable.items = _.cloneDeep(newDropTable.items)
    newDropTable.items[index] = undefined
    newDropTable.items = newDropTable.items.filter((d: any) => !!d)
    setDropTable({ ...newDropTable })
  }

  const addEmptyItem = () => {
    const newDropTable = { ...dropTable }
    newDropTable.items.push({
      iType: 'BaseWeapon',
      roll: 0,
      amount: 1,
    })
    setDropTable({ ...newDropTable })
  }
  const onChangeItemByIndex = (index: number, value: string) => {
    const newDropTable = { ...dropTable }
    newDropTable.items[index].roll = parseFloat(value)
    setDropTable({ ...newDropTable })
  }
  return (
    <div>
      <SelectItemDialog ref={selectItemDialogRef} onSelectItem={onSelectItem} />
      <SelectMonsterDialog
        ref={selectMonsterDialogRef}
        onSelectMonster={onSelectMonster}
      />
      <div className="[&>div]:border-b-gray-300 [&>div]:border-b [&>div]:mb-1 [&>div]:py-1">
        <div className="flex gap-1">
          <div className="min-w-[200px]">수정일시</div>
          <div className="flex flex-row items-center gap-1">
            {toYYYYMMDDHHMMSS(dropTable.updatedAt!)}
          </div>
        </div>
        <div className="flex gap-1">
          <div className="min-w-[200px]">선택된 몬스터</div>
          <div className="flex flex-row items-center gap-1">
            {dropTable.monster && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <div className="w-[80px] h-[80px] max-w-[80px] border-dark-blue border">
                    <img
                      src={`${toAPIHostURL(dropTable.monster?.thumbnail)}`}
                    />
                  </div>
                  <div>{dropTable!.monster!.name}</div>
                </div>
                <div
                  className="cursor-pointer rounded bg-green-500 text-white flex items-center justify-center py-0.5"
                  onClick={() => openSelectMonsterModal()}
                >
                  변경
                </div>
              </div>
            )}

            {!dropTable.monster && (
              <div>
                <div
                  className="px-[8px] cursor-pointer rounded bg-green-500 text-white flex items-center justify-center py-0.5"
                  onClick={() => openSelectMonsterModal()}
                >
                  몬스터 등록
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <div className="min-w-[200px]">드랍 아이템 목록</div>
          <div className="w-full">
            <div className="flex items-center gap-1 bg-dark-blue text-white w-full mb-1">
              <div className="min-w-[50px]">-</div>
              <div className="min-w-[150px]">아이템명</div>
              <div className="cursor-pointer w-[150px] max-w-[150px]">
                <Tooltip
                  interactive
                  content={
                    <div>
                      <div>
                        설정한 값을 최대 값으로 갖는 주사위를 굴려 1을 뽑을
                        확률입니다.
                      </div>
                      <div>
                        ----
                        <br />
                        만약 설정 값이 10이라면 주사위 굴려서 1을 뽑을 확률은
                        다음과 같습니다.
                      </div>
                      <div>= 1/10 = 10%</div>
                    </div>
                  }
                >
                  드랍 주사위(?)
                </Tooltip>
              </div>
            </div>
            {dropTable.items.map((dropItem, index) => {
              const { item } = dropItem
              return (
                <div className="flex items-center mb-1 gap-1" key={createKey()}>
                  <div className="min-w-[50px]">
                    <div
                      className="cursor-pointer rounded bg-red-700 text-white flex items-center justify-center w-[20px]"
                      onClick={() => removeItem(index)}
                    >
                      x
                    </div>
                  </div>
                  <div className="min-w-[150px]">
                    {item?.name && <div>{item?.name}</div>}
                    {!item?.name && (
                      <div
                        className="cursor-pointer rounded bg-green-500 text-white flex items-center justify-center py-0.5"
                        onClick={() => openSelectDropItemModal(index)}
                      >
                        드랍 아이템 선택
                      </div>
                    )}
                  </div>
                  <input
                    type="number"
                    className="w-[150px] max-w-[150px] flex border-2 rounded-md border-blue-200"
                    onChange={(e) => {
                      onChangeItemByIndex(index, e.target.value)
                    }}
                    value={dropItem.roll}
                  />
                  <div>{((1 / dropItem.roll) * 100).toFixed(3)}%</div>
                  <div className="flex items-center border border-gray-600">
                    <div>수량</div>
                    <input
                      type="number"
                      placeholder="드랍수량"
                      className="w-[150px] max-w-[150px] flex border-2 rounded-md border-blue-200"
                      onChange={(e) => {
                        const newDropTable = { ...dropTable }
                        newDropTable.items[index as number].amount = Number(
                          e.target.value,
                        )
                        setDropTable(newDropTable)
                      }}
                      value={dropItem.amount}
                    />
                  </div>
                </div>
              )
            })}

            <div
              className="cursor-pointer rounded bg-green-500 text-white flex items-center justify-center py-0.5"
              onClick={() => addEmptyItem()}
            >
              드랍 아이템 추가
            </div>
          </div>
        </div>
      </div>
      <div />
    </div>
  )
}

export default function Page({ params }: { params: { dropTableId: string } }) {
  const router = useRouter()
  const { dropTableId } = params

  const [dropTable, setDropTable] = useState<DropTable>()

  const loadDropTable = async (id: string) => {
    const { dropTable: rDropTable } = await fetchGetDropTable(id)
    setDropTable(rDropTable)
  }

  const onClickSave = async () => {
    let invalid = false
    let message = ''

    if (!dropTable) {
      invalid = true
      message = `버그`
    }

    if (!dropTable?.monster || !dropTable?.monsterId) {
      invalid = true
      message = `몬스터가 설정되지 않았습니다.`
    }

    dropTable!.items.forEach((dropItem, index) => {
      if (!dropItem.item) {
        invalid = true
        message = `설정되지 않은 아이템이 있습니다. ${index + 1}번째 드랍아이템`
        return
      }
      if (dropItem.roll <= 0) {
        invalid = true
        message = `드랍 주사위는 0이하가 될 수 없습니다. ${dropItem.item?.name}`
        return
      }
    })

    if (invalid)
      return Swal.fire({
        title: '실패',
        text: message || '알수없는 에러',
        icon: 'error',
        confirmButtonText: '확인',
      })

    if (dropTable?._id && dropTable?._id.length === 24) {
      await fetchPutDropTable(dropTable!)
    } else {
      await fetchCreateDropTable(dropTable!)
    }
    await Swal.fire({
      title: '성공',
      text: '수정되었습니다.',
      icon: 'success',
      confirmButtonText: '확인',
    })

    router.back()
  }

  useEffect(() => {
    if (dropTableId === 'create') {
      setDropTable({
        monsterId: '',
        items: [],
      })
    } else {
      loadDropTable(dropTableId)
    }
  }, [dropTableId])

  return (
    <Card>
      <CardBody>
        <h1 className="text-xl text-white bg-dark-blue mb-1">드랍 정보</h1>
        {dropTable && (
          <DropTableMonsterComponent
            dropTable={dropTable}
            setDropTable={setDropTable}
          />
        )}
        <Button
          className="flex items-center text-[14px]"
          size="sm"
          onClick={() => onClickSave()}
        >
          저장
        </Button>
      </CardBody>
    </Card>
  )
}
