'use client'

import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { Slider } from '@mui/material'
import { Tooltip } from '@material-tailwind/react'
import { BattlePreferenceRef, DropSoundKind } from './battle.interface'

export default forwardRef<any, any>(function BattlePreference(
  props: any,
  ref: ForwardedRef<BattlePreferenceRef>,
) {
  const audioItemDrop = useMemo(() => new Audio('/audio/item_drop.mp3'), [])
  const [audioItemDropVolume, setAudioItemDropVolume] = useState<number>(20)
  const audioItemEtcDrop = useMemo(() => new Audio('/audio/etc_drop.mp3'), [])
  const [audioItemEtcDropVolume, setAudioItemEtcDropVolume] =
    useState<number>(20)

  const onClickDropSound = (soundType: DropSoundKind) => {
    let selectedSound
    let selectedSoundVolume
    if (soundType === DropSoundKind.Weapon) {
      selectedSound = audioItemDrop
      selectedSoundVolume = audioItemDropVolume
    }

    if (soundType === DropSoundKind.Etc) {
      selectedSound = audioItemEtcDrop
      selectedSoundVolume = audioItemEtcDropVolume
    }

    if (selectedSound && selectedSoundVolume) {
      selectedSound.currentTime = 0
      selectedSound.volume = selectedSoundVolume / 100
      selectedSound.play()
    }
  }

  useImperativeHandle(ref, () => ({
    play: (soundType: DropSoundKind) => {
      onClickDropSound(soundType)
    },
  }))

  return (
    <div className="select-none">
      <div className="flex items-stretch bg-gray-300 rounded-l rounded-r">
        <Tooltip content="소리 볼륨을 설정 후 스피커 아이콘을 클릭하여 소리 크기를 확인하세요.">
          <div className="flex items-center justify-center px-[4px] text-gray-800 cursor-pointer">
            소리 설정
          </div>
        </Tooltip>

        {/* Sound List---------------------------------------*/}
        <div className="border-l border-gray-400 flex items-center text-[14px] gap-[8px] px-[4px]">
          {/* Weapon Drop Sound */}
          <div className="flex flex-col gap-[4px]">
            <div className="flex items-center gap-[4px]">
              <label className="flex items-center cursor-pointer gap-[4px]">
                {/* <input type="checkbox" /> */}
                <div>무기 드랍</div>
              </label>
              <i
                className="fa-solid fa-volume-high cursor-pointer"
                onClick={() => onClickDropSound(DropSoundKind.Weapon)}
              />
            </div>
            <div className="[&>span]:p-0">
              <Slider
                className="p-0"
                size="small"
                aria-label="Volume"
                value={audioItemDropVolume}
                onChange={(e: any) => {
                  setAudioItemDropVolume(e.target.value)
                }}
              />
            </div>
          </div>

          {/* Etc Drop Sound */}
          <div className="flex flex-col border-l gap-[4px] border-l-gray-500 px-[4px]">
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer gap-[4px]">
                {/* <input type="checkbox" /> */}
                <div>기타 드랍</div>
              </label>
              <i
                className="fa-solid fa-volume-high cursor-pointer"
                onClick={() => onClickDropSound(DropSoundKind.Etc)}
              />
            </div>
            <div className="[&>span]:p-0">
              <Slider
                className="p-0"
                size="small"
                aria-label="Volume"
                value={audioItemEtcDropVolume}
                onChange={(e: any) => {
                  setAudioItemEtcDropVolume(e.target.value)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
