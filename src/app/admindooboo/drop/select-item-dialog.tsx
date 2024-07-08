import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react'
import { Dialog, DialogBody, Tooltip } from '@material-tailwind/react'
import {
  BaseDefenceGear,
  BaseMisc,
  BaseWeapon,
  SelectItemDialogRef,
} from '@/interfaces/item.interface'
import { fetchGetBaseWeaponList } from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'
import { Pagination } from '@/interfaces/common.interface'
import createKey from '@/services/key-generator'
import {
  fetchGetBaseDefenceGearList,
  fetchGetBaseMiscList,
} from '@/services/api-admin-fetch'

function SelectItemDialog(
  {
    onSelectItem,
    onlyMisc = false,
  }: {
    onSelectItem: any
    onlyMisc: boolean
  },
  ref: ForwardedRef<SelectItemDialogRef>,
) {
  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [open, setOpen] = useState(false)
  const [baseWeapons, setBaseWeapons] = useState<BaseWeapon[]>([])
  const [baseMiscs, setBaseMiscs] = useState<BaseMisc[]>([])
  const [baseDefenceGears, setBaseDefenceGears] = useState<BaseDefenceGear[]>(
    [],
  )

  const [paginationBw, setPaginationBw] = useState<Pagination>()
  const [paginationBm, setPaginationBm] = useState<Pagination>()
  const [paginationBd, setPaginationBd] = useState<Pagination>()

  const loadBaseWeapons = useCallback(async (selectedPage = 1) => {
    const result = await fetchGetBaseWeaponList(
      {},
      { page: selectedPage, limit: 50 },
    )
    setBaseWeapons(result.weapons)
    setPaginationBw({
      page: result.page,
      total: result.total,
      totalPages: result.totalPages,
    })
  }, [])

  const loadBaseMiscs = useCallback(async (selectedPage = 1) => {
    const result = await fetchGetBaseMiscList(
      {},
      { page: selectedPage, limit: 50, sort: { createdAt: -1 } },
    )
    setBaseMiscs(result.baseMiscs)
    setPaginationBm({
      page: result.page,
      total: result.total,
      totalPages: result.totalPages,
    })
  }, [])

  const loadBaseDefenceGears = useCallback(async (selectedPage = 1) => {
    const result = await fetchGetBaseDefenceGearList(
      {},
      { page: selectedPage, limit: 50, sort: { createdAt: -1 } },
    )
    setBaseDefenceGears(result.baseDefenceGears)
    setPaginationBd({
      page: result.page,
      total: result.total,
      totalPages: result.totalPages,
    })
  }, [])

  const handleOpen = async () => {
    setOpen(!open)
    await Promise.all([
      loadBaseWeapons(),
      loadBaseMiscs(),
      loadBaseDefenceGears(),
    ])
  }
  const selectItem = (item: BaseWeapon | BaseMisc | BaseDefenceGear) => {
    setOpen(false)
    onSelectItem(item, selectedIndex)
  }
  useImperativeHandle(ref, () => ({
    openDialog: async (index: number) => {
      setSelectedIndex(index)
      await handleOpen()
    },
  }))

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogBody className="h-[42rem] overflow-y-scroll">
        <div>아이템 목록 - 클릭시 선택됩니다.</div>
        <div>
          {/* Weapon List */}
          {!onlyMisc && (
            <div>
              <div className="flex flex-wrap gap-1">
                {baseWeapons.map((baseWeapon) => {
                  return (
                    <div
                      key={baseWeapon._id}
                      className="cursor-pointer"
                      onClick={() => selectItem(baseWeapon)}
                    >
                      <Tooltip
                        interactive
                        content={
                          <div>
                            {baseWeapon.iLevel}/{baseWeapon.name}
                          </div>
                        }
                      >
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
              <div>
                {paginationBw && (
                  <div className="w-full flex justify-start mt-[15px]">
                    <div className="flex gap-[4px]">
                      {new Array(paginationBw.totalPages)
                        .fill(1)
                        .map((value, index) => {
                          return (
                            <div
                              className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === paginationBw.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                              onClick={() => loadBaseWeapons(index + 1)}
                              key={createKey()}
                            >
                              {index + 1}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Weapon List End */}

          {/* DefenceGear List */}
          <div className="flex flex-wrap gap-1">
            {baseDefenceGears.map((baseDefenceGear) => {
              return (
                <div
                  key={baseDefenceGear._id}
                  className="cursor-pointer"
                  onClick={() => selectItem(baseDefenceGear)}
                >
                  <Tooltip
                    interactive
                    content={<div>{baseDefenceGear.name}</div>}
                  >
                    <div className="max-w-[36px] w-[36px] h-[36px] p-[2px] border border-dark-blue">
                      <img
                        className="w-full h-full"
                        src={toAPIHostURL(baseDefenceGear.thumbnail)}
                      />
                    </div>
                  </Tooltip>
                </div>
              )
            })}
          </div>
          <div>
            {paginationBd && (
              <div className="w-full flex justify-start mt-[15px]">
                <div className="flex gap-[4px]">
                  {new Array(paginationBd.totalPages)
                    .fill(1)
                    .map((value, index) => {
                      return (
                        <div
                          className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === paginationBd.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                          onClick={() => loadBaseDefenceGears(index + 1)}
                          key={createKey()}
                        >
                          {index + 1}
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
          {/* DefenceGear List End */}

          {/* Misc List */}
          <div className="flex flex-wrap gap-1">
            {baseMiscs.map((baseMisc) => {
              return (
                <div
                  key={baseMisc._id}
                  className="cursor-pointer"
                  onClick={() => selectItem(baseMisc)}
                >
                  <Tooltip interactive content={<div>{baseMisc.name}</div>}>
                    <div className="max-w-[36px] w-[36px] h-[36px] p-[2px] border border-dark-blue">
                      <img
                        className="w-full h-full"
                        src={toAPIHostURL(baseMisc.thumbnail)}
                      />
                    </div>
                  </Tooltip>
                </div>
              )
            })}
          </div>
          <div>
            {paginationBm && (
              <div className="w-full flex justify-start mt-[15px]">
                <div className="flex gap-[4px]">
                  {new Array(paginationBm.totalPages)
                    .fill(1)
                    .map((value, index) => {
                      return (
                        <div
                          className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === paginationBm.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                          onClick={() => loadBaseMiscs(index + 1)}
                          key={createKey()}
                        >
                          {index + 1}
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
          {/* Misc List End */}
        </div>
      </DialogBody>
    </Dialog>
  )
}

export default forwardRef<any, any>(SelectItemDialog)
