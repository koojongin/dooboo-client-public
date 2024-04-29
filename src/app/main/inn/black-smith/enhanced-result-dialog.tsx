import { Dialog, DialogBody } from '@material-tailwind/react'
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react'
import {
  EnhancedResult,
  EnhancedResultDialogRef,
} from '@/interfaces/item.interface'
import toAPIHostURL from '@/services/image-name-parser'
import createKey from '@/services/key-generator'

function EnhancedResultDialog(
  { result }: { result: EnhancedResult },
  ref: ForwardedRef<EnhancedResultDialogRef>,
) {
  const [open, setOpen] = useState(false)
  const handleOpen = async () => {
    setOpen(true)
  }

  const handleToggle = () => {
    setOpen(!open)
  }

  useImperativeHandle(ref, () => ({
    open: () => {
      handleOpen()
    },
  }))

  return (
    <Dialog
      open={open}
      handler={handleToggle}
      className="min-w-[600px!important]"
    >
      <DialogBody className="min-h-[250px] overflow-y-scroll flex justify-center items-center">
        {!result && <div className="text-[50px] text-red-500">강화 실패!</div>}

        {result && (
          <div>
            <div className="text-[30px] text-green-700 flex justify-center mb-[10px]">
              강화 성공!
            </div>
            <div className="flex gap-[10px] items-center">
              {/* 왼쪽 */}
              <div className="border border-gray-800 p-[10px] rounded w-[250px]">
                <div className="flex justify-center">강화 전</div>
                <div className="border-b border-b-dark-blue mb-[4px]" />
                <div>
                  <div className="flex gap-[1px] justify-center">
                    {new Array(result.enhancedLog.snapshot.maxStarForce)
                      .fill(1)
                      .map((v, index) => {
                        const isOnStarForce =
                          index < result.enhancedLog.snapshot.starForce
                        return (
                          <img
                            className="w-[16px] h-[16px]"
                            key={createKey()}
                            src={`/images/star_${isOnStarForce ? 'on' : 'off'}.png`}
                          />
                        )
                      })}
                  </div>
                  <div className="flex justify-center">
                    <img
                      className="w-[40px] h-[40px]"
                      src={toAPIHostURL(result.enhancedLog.snapshot.thumbnail)}
                    />
                  </div>
                  <div className="flex justify-center">
                    {result.enhancedLog.snapshot.name}
                  </div>
                  <div className="flex justify-between">
                    <div>물리 피해</div>
                    <div>{result.enhancedLog.snapshot.damageOfPhysical}</div>
                  </div>

                  <div className="flex justify-between">
                    <div>화염 피해</div>
                    <div>{result.enhancedLog.snapshot.damageOfFire}</div>
                  </div>

                  <div className="flex justify-between">
                    <div>번개 피해</div>
                    <div>{result.enhancedLog.snapshot.damageOfLightning}</div>
                  </div>

                  <div className="flex justify-between">
                    <div>냉기 피해</div>
                    <div>{result.enhancedLog.snapshot.damageOfCold}</div>
                  </div>

                  <div className="flex justify-between">
                    <div>치명타 확률</div>
                    <div>+{result.enhancedLog.snapshot.criticalRate}%</div>
                  </div>

                  <div className="flex justify-between">
                    <div>치명타 배율</div>
                    <div>
                      +{result.enhancedLog.snapshot.criticalMultiplier}%
                    </div>
                  </div>
                </div>
              </div>
              <div>-&gt;</div>

              {/* 오른쪽 */}
              <div className="border border-gray-800 p-[10px] rounded  w-[250px]">
                <div className="flex justify-center">강화 후</div>
                <div className="border-b border-b-dark-blue mb-[4px]" />
                <div>
                  <div className="flex gap-[1px] justify-center">
                    {new Array(result.updatedWeapon.maxStarForce)
                      .fill(1)
                      .map((v, index) => {
                        const isOnStarForce =
                          index < result.updatedWeapon.starForce
                        return (
                          <img
                            className="w-[16px] h-[16px]"
                            key={createKey()}
                            src={`/images/star_${isOnStarForce ? 'on' : 'off'}.png`}
                          />
                        )
                      })}
                  </div>
                  <div className="flex justify-center">
                    <img
                      className="w-[40px] h-[40px]"
                      src={toAPIHostURL(result.updatedWeapon.thumbnail)}
                    />
                  </div>
                  <div className="flex justify-center">
                    {result.updatedWeapon.name}
                  </div>
                  <div className="flex justify-between">
                    <div>물리 피해</div>
                    <div>{result.updatedWeapon.damageOfPhysical}</div>
                  </div>

                  <div className="flex justify-between">
                    <div>화염 피해</div>
                    <div>{result.updatedWeapon.damageOfFire}</div>
                  </div>

                  <div className="flex justify-between">
                    <div>번개 피해</div>
                    <div>{result.updatedWeapon.damageOfLightning}</div>
                  </div>

                  <div className="flex justify-between">
                    <div>냉기 피해</div>
                    <div>{result.updatedWeapon.damageOfCold}</div>
                  </div>

                  <div className="flex justify-between">
                    <div>치명타 확률</div>
                    <div>+{result.updatedWeapon.criticalRate}%</div>
                  </div>

                  <div className="flex justify-between">
                    <div>치명타 배율</div>
                    <div>+{result.updatedWeapon.criticalMultiplier}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogBody>
    </Dialog>
  )
}

export default forwardRef<any, any>(EnhancedResultDialog)
