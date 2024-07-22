'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { fetchGradeInfo } from '@/services/api-fetch'
import { toColorByGrade, translate } from '@/services/util'
import createKey from '@/services/key-generator'
import { DefenceGearType, ItemTypeKind } from '@/interfaces/item.interface'

const SHOWABLE_TIER_COUNT = 9
export default function GradeInfoPage() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [attributes, setAttributes] = useState<{ [key: string]: any }>()
  const [tierLimit, setTierLimit] = useState<{ [key: string]: number }>()
  const [gradeTypeList, setGradeTypeList] = useState([
    { iType: ItemTypeKind.Weapon },
    { iType: ItemTypeKind.DefenceGear, gearType: DefenceGearType.BodyArmor },
    { iType: ItemTypeKind.DefenceGear, gearType: DefenceGearType.Greave },
    { iType: ItemTypeKind.DefenceGear, gearType: DefenceGearType.Helmet },
    { iType: ItemTypeKind.DefenceGear, gearType: DefenceGearType.Gloves },
    { iType: ItemTypeKind.DefenceGear, gearType: DefenceGearType.Boots },
    { iType: ItemTypeKind.DefenceGear, gearType: DefenceGearType.Belt },
  ])
  const [grades, setGrades] = useState<
    {
      name: string
      range: number[]
      weight: number
      totalWeight: number
    }[]
  >([])
  const loadGradeInfo = useCallback(async () => {
    const iType = searchParams.get('iType')
    const gearType = searchParams.get('gearType')
    if (!iType) return
    const result = await fetchGradeInfo(iType as ItemTypeKind, gearType as any)
    setAttributes(result.attributes)
    setGrades(result.grades)
    setTierLimit(result.tierLimit)
  }, [searchParams])

  const setSearchParam = useCallback(
    (key: string, value: any) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      current.set(key, String(value))
      return current
    },
    [searchParams],
  )

  const goToPageWithSearchParam = useCallback(
    (iType: ItemTypeKind, gearType?: DefenceGearType) => {
      const current = setSearchParam('iType', iType)
      current.set('gearType', gearType || '')
      router.push(`${pathname}?${current.toString()}`)
    },
    [pathname, router, setSearchParam],
  )

  useEffect(() => {
    const iType = searchParams.get('iType')
    if (!iType) {
      goToPageWithSearchParam(ItemTypeKind.Weapon)
    }
  }, [goToPageWithSearchParam, pathname, router, searchParams, setSearchParam])

  useEffect(() => {
    const iType = searchParams.get('iType')
    if (!iType) return
    loadGradeInfo()
  }, [loadGradeInfo, searchParams])

  return (
    <div className="w-full">
      <Card className="rounded p-[10px]">
        <div className="text-[24px]">등급정보</div>
        <div className="flex flex-wrap items-center gap-[4px]">
          {gradeTypeList.map((option) => {
            const { iType, gearType } = option
            const currentItemTypeKind = searchParams.get('iType')
            const currentGearType = searchParams.get('gearType') || undefined
            const isActive =
              iType === currentItemTypeKind && currentGearType === gearType
            return (
              <div
                key={createKey()}
                className={`ff-score font-bold text-[20px] p-[10px] bg-gray-400 text-white cursor-pointer border-2 border-dashed
                ${isActive ? 'bg-green-400 border-green-600' : 'border-gray-400'}`}
                onClick={() => {
                  goToPageWithSearchParam(iType as ItemTypeKind, gearType)
                }}
              >
                {translate(`iType:${iType}`)}
                {iType === ItemTypeKind.DefenceGear && (
                  <> - {translate(gearType!)}</>
                )}
              </div>
            )
          })}
        </div>
        <div className="text-[16px]">
          <div className="flex items-center">
            <div>•</div>
            <div>
              아이템이 드랍될 때 아래 테이블에 따른 값에 의해 옵션
              <span className="bg-yellow-500 text-white">(추가 속성)</span>과
              수치
              <span className="bg-blue-600 text-white">(tier range)</span>가
              결정됩니다.
            </div>
          </div>
          <div className="flex items-center">
            <div>•</div>
            <div className="flex items-center gap-[4px]">
              아이템의
              <span className="bg-yellow-500 text-white">추가 속성</span>은 해당
              티어(tier)의 범위 안에서 랜덤 값으로 설정됩니다.
            </div>
          </div>
          <div>
            {tierLimit &&
              Object.values(tierLimit).map((key, index) => {
                return (
                  <div className="flex items-center" key={createKey()}>
                    <div>•</div>
                    <div>
                      tier{index + 1}: 아이템 레벨 {key}부터 확률 존재
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex">
            <div className="text-[16px] bg-blue-600 text-white p-[4px]">
              tier range
            </div>
          </div>
          <div className="flex text-[16px]">
            <div className="flex flex-col border-b border-b-blue-gray-900">
              <div className="flex gap-[10px] items-center border border-blue-gray-900 border-b-0 bg-gray-400">
                <div className="text-white w-[60px] flex items-center justify-center">
                  등급
                </div>
                <div className="text-white w-[140px] flex items-center justify-center">
                  속성 추가 횟수
                </div>
                <div className="flex justify-center items-center w-[100px]">
                  weight
                </div>
                <div className="flex justify-center items-center w-[100px]">
                  %
                </div>
              </div>
              {grades.map((grade) => {
                const gradeName = grade.name
                return (
                  <div
                    key={`grade_${gradeName}`}
                    className="flex gap-[10px] items-center border border-blue-gray-900 border-b-0"
                  >
                    <div
                      className="text-white p-[4px] w-[60px] flex items-center justify-center"
                      style={{ background: toColorByGrade(gradeName) }}
                    >
                      {translate(gradeName)}
                    </div>
                    <div className="w-[140px] flex items-center justify-center">
                      {grade.range.join('~')}
                    </div>
                    <div className="flex justify-center items-center w-[100px]">
                      {grade.weight}
                    </div>
                    <div className="flex justify-center items-center w-[100px]">
                      {((grade.weight / grade.totalWeight) * 100).toFixed(2)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="mt-[10px] overflow-y-scroll h-[400px] relative">
          <div className="text-[18px] ff-ba flex bg-gray-400 text-white [&_div]:border-r [&_div]:border-r-white [&_div]:py-[4px] [&_div]:pl-[4px] sticky top-0">
            <div className="min-w-[30px]" />
            <div className="min-w-[200px]">추가 속성</div>
            {_.range(SHOWABLE_TIER_COUNT).map((v, tHeadIndex) => (
              <div
                key={createKey()}
                className="min-w-[80px] flex justify-center"
              >
                tier{tHeadIndex + 1}
              </div>
            ))}
          </div>
          <div className="flex border-b border-b-gray-500 border-dashed" />
          <div className="">
            {attributes &&
              _.sortBy(Object.keys(attributes)).map((attributeKey, index) => {
                const attribute: any = attributes[attributeKey]
                return (
                  <div
                    key={attributeKey}
                    className="text-[16px] w-full hover:bg-gray-200 cursor-pointer"
                  >
                    <div className="flex items-stretch w-full [&_div]:border-r [&_div]:border-b [&_div]:border-b-gray-500 [&_div]:border-r-gray-500 [&_div]:border-dashed">
                      <div className="min-w-[30px] flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="min-w-[200px] flex py-[2px] px-[4px]">
                        {translate(attributeKey)}
                      </div>
                      {_.range(SHOWABLE_TIER_COUNT).map((value, tierIndex) => {
                        const tierName = `tier${tierIndex + 1}`
                        const tierData = attribute[tierName] || {}
                        return (
                          <div
                            key={createKey()}
                            className="flex justify-center items-center min-w-[80px]"
                          >
                            {tierData?.range?.join('~')}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </Card>
    </div>
  )
}
