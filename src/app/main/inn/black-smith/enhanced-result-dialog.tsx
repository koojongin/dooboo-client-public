'use client'

import { Dialog, DialogBody } from '@material-tailwind/react'
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react'
import {
  EnhancedResult,
  EnhancedResultDialogRef,
} from '@/interfaces/item.interface'
import toAPIHostURL from '@/services/image-name-parser'
import createKey from '@/services/key-generator'
import { toColorByGrade, toYYYYMMDDHHMMSS, translate } from '@/services/util'
import { getTotalFlatDamage } from '@/services/yg-util'

export function EnhancedSnapshotBox({ enhancedLog }: { enhancedLog: any }) {
  const enhancedWeapon = enhancedLog.snapshot
  const afterWeapon = enhancedLog?.snapshot?.after
  return (
    <div className="flex flex-col rounded shadow-gray-400 shadow-md bg-gradient-to-br from-slate-500 via-gray-300 to-slate-600 border-2">
      <div className="flex flex-row justify-stretch items-stretch p-[5px]">
        <div className="min-w-[240px] p-[1px]">
          <div className="flex justify-center text-[20px] h-[30px] items-center">
            <div className="text-[20px] flex items-center ff-gs">강화 전</div>
          </div>
          <div className="bg-gray-800 rounded">
            <div
              className="pb-[8px] rounded bg-gradient-to-br from-[#5b5b5b80] to-blue-gray-100/50 h-full"
              style={{
                borderColor: toColorByGrade(enhancedWeapon.iGrade),
                borderWidth: '2px',
              }}
            >
              <div className="flex gap-[4px] justify-center items-center px-[6px] h-[30px]">
                <div className="flex items-center gap-[2px]">
                  <img
                    className="w-[16px] h-[16px]"
                    key={createKey()}
                    src="/images/star_on.png"
                  />
                  <div className="ff-score font-bold">
                    {enhancedWeapon.starForce}
                  </div>
                </div>
                <div className="ff-score font-bold">/</div>
                <div className="flex items-center gap-[2px]">
                  <img
                    className="w-[16px] h-[16px]"
                    key={createKey()}
                    src="/images/star_off.png"
                  />
                  <div className="ff-score font-bold">
                    {enhancedWeapon.maxStarForce}
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-[4px] py-[2px] mb-[4px] bg-[#9bb5c44f]">
                <img
                  className="w-[40px] h-[40px] bg-[#c4c4c4] border-gray-600 border p-[2px] rounded"
                  style={{
                    borderWidth: '2px',
                    borderRadius: '4px',
                  }}
                  src={toAPIHostURL(enhancedWeapon.thumbnail)}
                />
                <div className="flex justify-center ff-wavve text-[20px]">
                  {enhancedWeapon.name}+{enhancedWeapon.starForce}
                </div>
              </div>
              <div className="px-[6px] mt-[10px]">
                <div className="">
                  기본 속성({getTotalFlatDamage(enhancedWeapon)})
                </div>
                <div className="border-b border-b-white my-[2px]" />
                <div>
                  <div className="flex justify-between">
                    <div>물리 피해</div>
                    <div>{enhancedWeapon.damageOfPhysical}</div>
                  </div>

                  <div className="flex justify-between">
                    <div>화염 피해</div>
                    <div>{enhancedWeapon.damageOfFire}</div>
                  </div>

                  <div className="flex justify-between">
                    <div>번개 피해</div>
                    <div>{enhancedWeapon.damageOfLightning}</div>
                  </div>

                  <div className="flex justify-between">
                    <div>냉기 피해</div>
                    <div>{enhancedWeapon.damageOfCold}</div>
                  </div>

                  <div className="flex justify-between">
                    <div>치명타 확률</div>
                    <div>+{enhancedWeapon.criticalRate}%</div>
                  </div>

                  <div className="flex justify-between">
                    <div>치명타 배율</div>
                    <div>+{enhancedWeapon.criticalMultiplier}%</div>
                  </div>
                </div>
              </div>
              <div className="px-[6px]">
                {Object.keys(enhancedWeapon.additionalAttributes || {}).length >
                  0 && (
                  <div className="mt-[5px]">
                    <div className="text-[#ffea00] ff-score font-bold">
                      추가 속성
                    </div>
                    <div className="border-b border-b-white mt-[2px] mb-[4px]" />
                    {Object.keys(enhancedWeapon.additionalAttributes!).map(
                      (key: string) => {
                        if (!enhancedWeapon.additionalAttributes) return
                        const value = enhancedWeapon.additionalAttributes[key]
                        return (
                          <div
                            key={createKey()}
                            className="flex justify-between"
                          >
                            <div>{translate(key)}</div>
                            <div>{value}</div>
                          </div>
                        )
                      },
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LEFT------------------------------------------------*/}

        <div className="flex items-center px-[10px] text-[#4e4e4e] text-[20px]">
          <i className="fa-solid fa-arrow-right" />
        </div>

        {/* RIGHT------------------------------------------------*/}
        <div className="min-w-[240px] p-[1px]">
          <div className="flex justify-center text-[20px] h-[30px] items-center">
            {afterWeapon && (
              <div className="text-[20px] flex items-center ff-gs">강화 후</div>
            )}
            {!afterWeapon && (
              <div className="flex justify-center items-center text-[14px] bg-opacity-55 p-[1px] rounded ff-gs">
                강화 기록을 찾을 수 없습니다.
              </div>
            )}
          </div>
          {afterWeapon && (
            <div className="bg-gray-800 rounded">
              <div
                className="pb-[8px] rounded bg-gradient-to-br from-[#5b5b5b80] to-blue-gray-100/50 h-full"
                style={{
                  borderColor: toColorByGrade(afterWeapon.iGrade),
                  borderWidth: '2px',
                  borderRadius: '4px',
                }}
              >
                <div className="flex gap-[4px] justify-center items-center px-[6px] h-[30px]">
                  <div className="flex items-center gap-[2px]">
                    <img
                      className="w-[16px] h-[16px]"
                      key={createKey()}
                      src="/images/star_on.png"
                    />
                    <div className="ff-score font-bold">
                      {afterWeapon.starForce}
                    </div>
                  </div>
                  <div className="ff-score font-bold">/</div>
                  <div className="flex items-center gap-[2px]">
                    <img
                      className="w-[16px] h-[16px]"
                      key={createKey()}
                      src="/images/star_off.png"
                    />
                    <div className="ff-score font-bold">
                      {afterWeapon.maxStarForce}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center gap-[4px] py-[2px] mb-[4px] bg-[#9bb5c44f]">
                  <img
                    className="w-[40px] h-[40px] bg-[#c4c4c4] border-gray-600 border p-[2px] rounded"
                    style={{
                      borderWidth: '2px',
                      borderRadius: '4px',
                    }}
                    src={toAPIHostURL(afterWeapon.thumbnail)}
                  />
                  <div className="flex justify-center ff-wavve text-[20px]">
                    {afterWeapon.name}+{afterWeapon.starForce}
                  </div>
                </div>
                <div className="px-[6px] mt-[10px]">
                  <div className="">
                    기본 속성({getTotalFlatDamage(afterWeapon)})
                  </div>
                  <div className="border-b border-b-white my-[2px]" />
                  <div>
                    <div className="flex justify-between">
                      <div>물리 피해</div>
                      <div>{afterWeapon.damageOfPhysical}</div>
                    </div>

                    <div className="flex justify-between">
                      <div>화염 피해</div>
                      <div>{afterWeapon.damageOfFire}</div>
                    </div>

                    <div className="flex justify-between">
                      <div>번개 피해</div>
                      <div>{afterWeapon.damageOfLightning}</div>
                    </div>

                    <div className="flex justify-between">
                      <div>냉기 피해</div>
                      <div>{afterWeapon.damageOfCold}</div>
                    </div>

                    <div className="flex justify-between">
                      <div>치명타 확률</div>
                      <div>+{afterWeapon.criticalRate}%</div>
                    </div>

                    <div className="flex justify-between">
                      <div>치명타 배율</div>
                      <div>+{afterWeapon.criticalMultiplier}%</div>
                    </div>
                  </div>
                </div>
                <div className="px-[6px]">
                  {Object.keys(afterWeapon.additionalAttributes || {}).length >
                    0 && (
                    <div className="mt-[5px]">
                      <div className="text-[#ffea00] ff-score font-bold">
                        추가 속성
                      </div>
                      <div className="border-b border-b-white mt-[2px] mb-[4px]" />
                      {Object.keys(afterWeapon.additionalAttributes!).map(
                        (key: string) => {
                          if (!afterWeapon.additionalAttributes) return
                          const value = afterWeapon.additionalAttributes[key]
                          return (
                            <div
                              key={createKey()}
                              className="flex justify-between"
                            >
                              <div>{translate(key)}</div>
                              <div>{value}</div>
                            </div>
                          )
                        },
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/*--------------------------------------*/}
      <div className="flex bg-white overflow-hidden border-t border-dashed border-gray-800">
        <div className="ff-gs-all text-white bg-[#182243c7] w-full flex px-[5px] py-[2px] gap-[4px]">
          <div>강화 일시 -</div>
          <div>{toYYYYMMDDHHMMSS(enhancedLog.createdAt)}</div>
        </div>
      </div>
    </div>
  )
}

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
        {!result && <div className="text-[40px] text-red-500">강화 실패!</div>}

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
