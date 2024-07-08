import {
  Popover,
  PopoverContent,
  PopoverHandler,
} from '@material-tailwind/react'
import { useState } from 'react'
import createKey from '@/services/key-generator'

export enum EmoticonKind {
  BlueArchive = 'BlueArchive',
  Pepe = 'Pepe',
  Mangu = 'Mangu',
  Nike = 'Nike',
  Genshin = 'Genshin',
  StarSeed = 'StarSeed',
  BrownDust = 'BrownDust',
  QwakCheol = 'QwakCheol',
}
export function EmojiPopOver({ onSelect }: any) {
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const [selectedEmoticonGroup, setSelectedEmoticonGroup] =
    useState<EmoticonKind>(EmoticonKind.BlueArchive)

  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false),
  }
  const selectEmoji = (emojiSrc: string) => {
    triggers.onMouseLeave()
    onSelect(emojiSrc)
  }

  return (
    <Popover handler={setOpenPopover} open={openPopover} placement="left">
      <PopoverHandler>
        <div className="w-[32px] h-[32px] border flex items-center justify-center cursor-pointer">
          <img src="/images/emoji/icon_emoji_select.png" />
        </div>
      </PopoverHandler>
      <PopoverContent className="rounded m-0 p-[10px]">
        <div className="flex w-full overflow-x-scroll text-[16px]">
          {Object.keys(EmoticonKind).map((emoticonName, index, row) => {
            return (
              <div
                key={`emoji_${emoticonName}`}
                onClick={() =>
                  setSelectedEmoticonGroup(emoticonName as EmoticonKind)
                }
                className={`${emoticonName === selectedEmoticonGroup ? 'bg-dark-blue text-white' : ''} flex items-center justify-center ff-ba ff-skew border border-gray-400 min-w-[40px] min-h-[24px] px-[2px] cursor-pointer border-b-0 ${row.length === index + 1 ? '' : 'border-r-0'}`}
              >
                {emoticonName}
              </div>
            )
          })}
        </div>
        <div className="flex flex-wrap content-start gap-[1px] w-[604px] overflow-y-scroll gap-y-0 h-[300px] border-gray-500 border">
          {selectedEmoticonGroup === EmoticonKind.BlueArchive &&
            new Array(31).fill(1).map((v, index) => {
              const src = `/images/emoji/ClanChat_Emoji_${`${index + 1}`.padStart(2, '0')}_Kr.png`
              return (
                <img
                  key={createKey()}
                  src={src}
                  onClick={() => selectEmoji(src)}
                  className="w-[80px] h-[80px] cursor-pointer"
                />
              )
            })}
          {selectedEmoticonGroup === EmoticonKind.Pepe &&
            new Array(16).fill(1).map((v, index) => {
              const src = `/images/emoji/pepe_${`${index + 1}`.padStart(3, '0')}.png`
              return (
                <img
                  key={createKey()}
                  src={src}
                  onClick={() => selectEmoji(src)}
                  className="w-[80px] h-[80px] cursor-pointer"
                />
              )
            })}
          {selectedEmoticonGroup === EmoticonKind.Mangu &&
            new Array(25).fill(1).map((v, index) => {
              const src = `/images/emoji/mangu_${`${index + 1}`.padStart(3, '0')}.png`
              return (
                <img
                  key={createKey()}
                  src={src}
                  onClick={() => selectEmoji(src)}
                  className="w-[80px] h-[80px] cursor-pointer"
                />
              )
            })}
          {selectedEmoticonGroup === EmoticonKind.Nike &&
            new Array(24).fill(1).map((v, index) => {
              const src = `/images/emoji/nike_${`${index + 1}`.padStart(3, '0')}.png`
              return (
                <img
                  key={createKey()}
                  src={src}
                  onClick={() => selectEmoji(src)}
                  className="w-[80px] h-[80px] cursor-pointer"
                />
              )
            })}
          {selectedEmoticonGroup === EmoticonKind.Genshin &&
            new Array(29).fill(1).map((v, index) => {
              const src = `/images/emoji/genshin_${`${index + 1}`.padStart(3, '0')}.webp`
              return (
                <img
                  key={createKey()}
                  src={src}
                  onClick={() => selectEmoji(src)}
                  className="w-[80px] h-[80px] cursor-pointer"
                />
              )
            })}
          {selectedEmoticonGroup === EmoticonKind.StarSeed &&
            new Array(22).fill(1).map((v, index) => {
              const src = `/images/emoji/star_seed_${`${index}`.padStart(3, '0')}.webp`
              return (
                <img
                  key={createKey()}
                  src={src}
                  onClick={() => selectEmoji(src)}
                  className="w-[80px] h-[80px] cursor-pointer"
                />
              )
            })}
          {selectedEmoticonGroup === EmoticonKind.BrownDust &&
            new Array(16).fill(1).map((v, index) => {
              const src = `/images/emoji/brown_dust_${`${index}`.padStart(3, '0')}.webp`
              return (
                <img
                  key={createKey()}
                  src={src}
                  onClick={() => selectEmoji(src)}
                  className="w-[80px] h-[80px] cursor-pointer"
                />
              )
            })}
          {selectedEmoticonGroup === EmoticonKind.QwakCheol &&
            new Array(32).fill(1).map((v, index) => {
              const src = `/images/emoji/qwak-cheol_${`${index}`.padStart(3, '0')}.webp`
              return (
                <img
                  key={createKey()}
                  src={src}
                  onClick={() => selectEmoji(src)}
                  className="w-[80px] h-[80px] cursor-pointer"
                />
              )
            })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
