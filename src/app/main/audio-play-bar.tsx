'use client'

import { useEffect } from 'react'

export default function AudioPlayBar() {
  const play = () => {}
  const pause = () => {}
  useEffect(() => {




  }, [])

  return (
    <div className="bg-white bg-opacity-90 w-full wide:px-[20px]">
      <div className="py-[4px] flex items-center min-h-[40px]">
        <div className="flex gap-[2px] mt-[1px]">
          <img
            className="w-[20px] cursor-pointer"
            src="/images/audio/icon_audio_play.png"
            onClick={() => play()}
          />
          <img
            className="w-[20px] cursor-pointer"
            src="/images/audio/icon_audio_pause.png"
            onClick={() => pause()}
          />
        </div>

        <div className="ml-[10px] ff-score text-[16px] text-[#464646] font-bold">
          test?????
          {/* 현재 상태에 맞는 무언가 {currentAudio?.title} /{' '}
          {`${currentAudio?.audio.paused ? '정지됨' : '런'}`} */}
        </div>
      </div>
    </div>
  )
}
