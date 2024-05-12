import toAPIHostURL from '@/services/image-name-parser'

export function EnhancedLogBoxComponent({ enhancedLog }: { enhancedLog: any }) {
  return (
    <div className="flex cursor-pointer flex-col">
      <div className="ff-gs bg-gray-400 text-white px-[4px] mb-[2px]">
        [공유] 강화로그
      </div>
      <div className="flex gap-[4px]">
        <div className="w-[36px] h-[36px] border border-gray-600 p-[2px]">
          <img
            className="w-full h-full"
            src={toAPIHostURL(enhancedLog.snapshot.thumbnail)}
          />
        </div>
        <div className="flex items-center">
          <div className="flex items-center">
            <div>
              {enhancedLog.snapshot.name} +{enhancedLog.snapshot.starForce}
            </div>
            <div className="ml-[5px] text-[12px] flex items-center gap-[4px] font-bold">
              <i className="fa-solid fa-arrow-right" />
              <div className="bg-blue-600 text-white w-[18px] h-[18px] rounded-full flex items-center justify-center">
                <i className="fa-solid fa-question" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
