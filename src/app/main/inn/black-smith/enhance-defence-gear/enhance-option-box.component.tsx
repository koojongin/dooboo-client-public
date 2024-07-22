import { Tooltip } from '@material-tailwind/react'
import _ from 'lodash'
import createKey from '@/services/key-generator'
import { translate } from '@/services/util'
import { getValueByScrollPercentString } from '@/services/craft/enhance.util'
import {
  DefenceGearEnhanceDataResponse,
  IEnhanceOption,
} from '@/services/craft/enhance.enum'

export function EnhanceOptionBoxComponent({
  scrollOption,
  selectedEnhanceScroll,
  onSelectScroll,
  enhanceData,
}: {
  scrollOption: { percent: number } | undefined
  selectedEnhanceScroll: IEnhanceOption | undefined
  onSelectScroll: (
    enhanceOption: IEnhanceOption,
    percent: number,
  ) => Promise<void>
  enhanceData: DefenceGearEnhanceDataResponse
}) {
  return (
    <>
      {enhanceData.list.map((enhanceOption) => {
        const { name, value } = enhanceOption
        const order = ['hundred', 'sixty', 'ten']
        const sortedScrollKeys = _.sortBy(
          Object.keys(value),
          (keyValue: string) => {
            const index = order.indexOf(keyValue)
            return index === -1 ? order.length : index
          },
        )
        return (
          <div
            key={createKey()}
            className={`flex flex-col py-[5px] px-[10px] border border-gray-300 bg-gray-100 w-full text-gray-800 rounded shadow-md 
                      ${selectedEnhanceScroll?.name === name ? 'bg-green-400 text-white border-green-300 shadow-green-300' : ''}`}
          >
            <div className="flex items-center justify-between bg-white p-[5px] rounded-t">
              <div className="text-gray-800">{translate(name)} 주문서</div>
              <div className="flex gap-[2px]">
                {sortedScrollKeys.map((scrollNumberKey) => {
                  const data = {
                    percent: getValueByScrollPercentString(scrollNumberKey),
                    value: value[scrollNumberKey],
                  }
                  return (
                    <Tooltip
                      key={createKey()}
                      content={
                        <div>
                          <div>{data.percent}% 확률로 성공</div>
                          <div>
                            성공 시 해당 수치 +{data.value} 추가 및 동일한
                            수치의 스타포스 파워 추가
                          </div>
                          <div>실패하더라도 스타포스 레벨 +1 추가</div>
                        </div>
                      }
                    >
                      <div
                        key={createKey()}
                        className={`flex flex-col border p-[4px] pb-[2px] rounded cursor-pointer bg-white text-gray-800 shadow-md 
                                  ${selectedEnhanceScroll?.name === name && scrollOption?.percent === data.percent ? 'border-2 border-green-800' : 'border-gray-200'}`}
                        onClick={() =>
                          onSelectScroll(enhanceOption, data.percent)
                        }
                      >
                        <div
                          className="w-[40px] h-[40px] bg-contain bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url('/images/black-smith/scroll${data.percent}.png')`,
                          }}
                        />
                        <div className="text-[14px] text-center">
                          {data.percent}%
                        </div>
                        <div className="text-center text-[14px]">
                          +{data.value}
                        </div>
                      </div>
                    </Tooltip>
                  )
                })}
              </div>
            </div>
            {selectedEnhanceScroll?.name === name && (
              <div className="bg-gray-200 text-gray-800 rounded-b p-[5px] text-[14px] flex flex-col gap-[1px]">
                {[{}, ...sortedScrollKeys].map(
                  (scrollNumberKey: any, index) => {
                    let data
                    if (index !== 0)
                      data = {
                        percent: getValueByScrollPercentString(scrollNumberKey),
                        value: value[scrollNumberKey],
                      }
                    return (
                      <div
                        key={createKey()}
                        className={`flex items-center ${index === 0 ? 'bg-gray-800 text-white' : ''}`}
                      >
                        <div
                          className={`w-[70px] text-center text-white ${index === 0 ? '' : 'bg-gray-400'}`}
                        >
                          {data?.percent ? `${data.percent}%` : '성공 확률'}
                        </div>
                        <div className="ml-[10px]">
                          {data?.value ? `+${data.value}` : '추가 수치'}
                        </div>
                      </div>
                    )
                  },
                )}
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
