import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { Chip, Dialog, DialogBody } from '@material-tailwind/react'
import {
  BaseMisc,
  BaseWeapon,
  SimulateBattleDialogRef,
} from '@/interfaces/item.interface'
import { fetchSimulateBattle } from '@/services/api-fetch'
import { formatNumber, translate } from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'

function SimulateBattleDialog(
  props: any,
  ref: ForwardedRef<SimulateBattleDialogRef>,
) {
  const [open, setOpen] = useState(false)
  const [auctionId, setAuctionId] = useState<string>()
  const [battleLogs, setBattleLogs]: any = useState([])
  const [battleResult, setBattleResult]: any = useState()
  const handleOpen = () => {
    setOpen(!open)
  }

  const simulateBattle = useCallback(async () => {
    if (!auctionId) return
    const result = await fetchSimulateBattle(auctionId)
    setBattleLogs(result.battleLogs)
    setBattleResult(result)
  }, [auctionId])

  useImperativeHandle(ref, () => ({
    openDialog: async (_auctionId: string) => {
      setAuctionId(_auctionId)
      handleOpen()
    },
  }))

  useEffect(() => {
    simulateBattle()
  }, [simulateBattle])

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogBody className="h-[300px] overflow-y-scroll">
        <div>허수아비를 타겟으로 데미지를 시뮬레이션한 결과입니다.</div>
        <div className="text-[20px]">
          {battleResult?.weapon && (
            <div className="flex items-center gap-[4px] border border-gray-800 border-dashed p-[2px] ff-gs my-[6px]">
              <div className="w-[40px] h-[40px] border border-gray-600 p-[2px] rounded">
                <img
                  className="w-full h-full"
                  src={toAPIHostURL(battleResult?.weapon.thumbnail)}
                />
              </div>
              {battleResult.weapon.name}[+{battleResult.weapon.starForce}]
            </div>
          )}
          <div>
            총 데미지 :{' '}
            {formatNumber(
              battleLogs.reduce((prev: number, next: any) => {
                return prev + next.damage
              }, 0),
            )}
          </div>
        </div>
        <div className="text-white text-[16px]">
          {battleLogs.map((battleLog: any, index: any) => {
            return (
              <div
                key={`battlelog-${index}`}
                className="animate-slideIn flex items-center mb-1 gap-1 transition text-black opacity-0"
                style={{ '--delay': `${index * 0.25}s` } as React.CSSProperties}
              >
                <Chip
                  variant="gradient"
                  size="sm"
                  className="text-[14px] rounded px-[4px] min-w-[70px] flex items-center justify-center py-[2px]"
                  color={battleLog.isCriticalHit ? 'red' : 'indigo'}
                  value={`${index + 1}Turn`}
                />
                <div className="flex items-center gap-[4px]">
                  {/* TAGS-----------*/}
                  {battleLog.skills?.length > 0 && (
                    <div className="ff-wavve rounded-[4px] bg-blue-gray-500 text-white text-[16px] py-[2px] px-[8px] flex items-center justify-center">
                      {translate(battleLog.skills[0])}
                    </div>
                  )}
                  {battleLog.isCriticalHit && (
                    <div className="ff-wavve rounded-[4px] bg-yellow-500 text-red-700 text-[18px] py-[2px] px-[8px] flex items-center justify-center">
                      치명타!
                    </div>
                  )}
                  {/* TAGS END----------*/}
                  <div className="bg-light-blue-300 ff-ba text-[20px] px-[6px] py-[1px] text-white rounded">
                    {formatNumber(battleLog.damage)}
                  </div>
                  <div>의 피해를 입혔습니다.</div>
                </div>
                <div className="ml-auto">
                  남은 체력:{formatNumber(battleLog.currentHp)}
                </div>
              </div>
            )
          })}
        </div>
      </DialogBody>
    </Dialog>
  )
}

export default forwardRef<any, any>(SimulateBattleDialog)
