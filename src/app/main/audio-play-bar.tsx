'use client'

import {
  Popover,
  PopoverContent,
  PopoverHandler,
  Slider,
} from '@material-tailwind/react'
import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import createKey from '@/services/key-generator'

export default function AudioPlayBar() {
  const [bgmNames, setBgmNames] = useState<string[]>([])
  const [volume, setVolume] = useState<number>(30)
  const [, setForceRender] = useState<HTMLAudioElement>()
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false),
  }

  const bgmRef = useRef<HTMLAudioElement>()

  const openBgmList = () => {
    setOpenPopover(!openPopover)
  }
  const play = () => {
    bgmRef.current?.play()
    if (bgmRef.current) {
      bgmRef.current.onended = () => {
        const onStart = true
        selectRandomBgm(onStart)
      }
    }
    setForceRender(undefined)
    setTimeout(() => {
      setForceRender(bgmRef.current)
      if (!bgmRef.current) return
      bgmRef.current.volume = volume / 100
    }, 1)
  }
  const pause = () => {
    bgmRef.current?.pause()
    setForceRender(undefined)
    setTimeout(() => {
      setForceRender(bgmRef.current)
    }, 1)
  }

  const test = () => {
    if (bgmRef.current) {
      bgmRef.current.currentTime = bgmRef.current.duration - 1
    }
  }

  const getRandomBgmPath = (list: string[]) => {
    const [selected] = _.shuffle(list)
    return `/bgm/${selected}`
  }

  const replaceOnlyFileName = (path: string) => {
    return decodeURIComponent(path)
      .replace('http://dooboo.online:3002/bgm/', '')
      .replace('.flac', '')
      .replace('.mp3', '')
  }

  const changeBgm = (path: string, wasRunning?: boolean) => {
    const isRunning = bgmRef.current && !bgmRef.current.paused
    bgmRef.current?.pause()
    bgmRef.current = new Audio(path)
    bgmRef.current.volume = volume / 100
    setForceRender(bgmRef.current)

    if (isRunning || wasRunning) {
      play()
    }
  }

  const selectRandomBgm = (wasRunning?: boolean) => {
    changeBgm(getRandomBgmPath(bgmNames), wasRunning)
  }

  useEffect(() => {
    if (bgmNames.length > 0) return
    setBgmNames(getBgmNames())
    return () => {}
  }, [])

  useEffect(() => {
    if (bgmNames.length === 0) return
    selectRandomBgm()
  }, [bgmNames])

  useEffect(() => {
    return () => {
      bgmRef.current?.pause()
    }
  }, [bgmRef])

  useEffect(() => {
    if (!bgmRef.current) return
    bgmRef.current.volume = volume / 100
  }, [volume])

  return (
    <div className="bg-white bg-opacity-90 w-full wide:px-[20px]">
      <div className="py-[4px] flex items-center min-h-[40px]">
        <div className="flex gap-[2px] mt-[1px] items-center">
          {bgmRef.current && bgmRef.current.paused && (
            <img
              className="w-[20px] cursor-pointer"
              src="/images/audio/icon_audio_play.png"
              onClick={() => play()}
            />
          )}
          {bgmRef.current && !bgmRef.current.paused && (
            <img
              className="w-[20px] cursor-pointer"
              src="/images/audio/icon_audio_pause.png"
              onClick={() => pause()}
            />
          )}
          {bgmRef.current && (
            <img
              className="w-[20px] cursor-pointer"
              src="/images/audio/icon_audio_random.png"
              onClick={() => selectRandomBgm()}
            />
          )}
          <Popover handler={setOpenPopover} open={openPopover}>
            <PopoverHandler>
              <img
                className="w-[20px] cursor-pointer"
                src="/images/audio/icon_audio_list.png"
                onClick={() => openBgmList()}
              />
            </PopoverHandler>
            <PopoverContent className="rounded p-[8px] p-[10px] max-h-[200px] overflow-y-scroll">
              <div className="flex flex-col gap-[2px]">
                {bgmNames.map((title, index) => {
                  return (
                    <div
                      key={createKey()}
                      onClick={() => changeBgm(`/bgm/${title}`, true)}
                      className="hover:bg-gray-400 hover:text-white cursor-pointer p-[4px]"
                    >
                      [{`${index + 1}`.padStart(3, '0')}]{' '}
                      {title.replace('.mp3', '').replace('.flac', '')}
                    </div>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex w-[100px] max-w-[100px] flex-col gap-8">
            <Slider
              className="min-w-[100px]"
              size="sm"
              value={volume}
              onChange={(e) => {
                if (!e.target.value) return
                setVolume(parseFloat(e.target.value))
              }}
            />
          </div>
        </div>

        <div className="ml-[10px] ff-score text-[16px] text-[#464646] font-bold">
          {bgmRef && replaceOnlyFileName(bgmRef.current?.src || '')}
        </div>
        <div
          className="cursor-pointer bg-green-300 text-white"
          onClick={() => test()}
        >
          test
        </div>
      </div>
    </div>
  )
}

function getBgmNames() {
  return [
    '01 Tales are about to be weaved (Title+Login BGM).mp3.flac',
    '01 This Tales (Japanese Server Special ver.) (Opening).mp3.flac',
    '01 Till the End of Infinity (3D Movie Opening).mp3.flac',
    '01 We wish your merry Christmas (TW ver.) (Christmas Limit Login).mp3.flac',
    '01. Second Run.flac',
    '02 Have yourself a Merry Christmas ~ White LEAF (Christmas Event).mp3.flac',
    '02 Make U THE Weaver (Character Selection).mp3.flac',
    '02 Past (Event).mp3.flac',
    "02 The Takes (ESTi's Fairytale remix)(Login+Temple remix).mp3.flac",
    '02. attack ～ Final Killer ～ Red Eyes ～ attack.flac',
    '03 Blue Coral (Coral Cave).mp3.flac',
    '03 Close to the Weaver (Kriden Plains,Penine Forest,).mp3.flac',
    '03 Feliz Navidad (Christmas Event).mp3.flac',
    '03 Magical Autumn ~ Mahou no Aki (Clad (Night)).mp3.flac',
    '03. 四千年 ～ 夜明け.flac',
    '04 Fight Master (Fight Club).mp3.flac',
    '04 First Run (Kriden Plains).mp3.flac',
    '04 is this 2step (Doppleganger Forest).mp3.flac',
    '04 Where santa goes (Christmas Dungeon).mp3.flac',
    '04. money money money ～ 鳥たちのワルツ.flac',
    '05 jungle jungle (Kauru (Midday)).mp3.flac',
    '05 MOTIVITY (Narvik (Midday)).mp3.flac',
    '05 Second Run (Kriden Plains).mp3.flac',
    '05 White fantasia (Eltibo (Midday)) .mp3.flac',
    '05. Reminiscence.flac',
    '06 Brand new spring is coming (Weapon, Tool Store).mp3.flac',
    '06 Deadly Mansion (Event).mp3.flac',
    '06 Ice candy tree (White Forest (Midday)) .mp3.flac',
    '06 Tomb of Honor (Tomb of the Hero).mp3.flac',
    "06. Tales are about to be weaved ～ And, Don't Forget ～ Carnival town ～ LAPUTA.flac",
    "07 it's not over yet (Event) .mp3.flac",
    '07 Joke (Event).mp3.flac',
    '07 March of the Hero (Accipiter).mp3.flac',
    "07 Nymph's allurement (White Forest (Night)).mp3.flac",
    '07. Battle in the Tomb of Hero ~ Tomb of Honor.flac',
    '08 autumn leaves (Clad (Midday)).mp3.flac',
    '08 money money money (Bank).mp3.flac',
    '08 Sweet Place (Inn, Hospital, Temple etc.).mp3.flac',
    '08 Wild spirit (Land in the Depth of Winter (Midday)).mp3.flac',
    '08. Apparition.flac',
    '09 big tick (Cave of Chaos).mp3.flac',
    '09 dark (Cave of Chaos).mp3.flac',
    '09 Nocturn for Eltibo (Eltibo (Night)).mp3.flac',
    '09 Waltz of the Birds (Magic Store, General Store).mp3.flac',
    '09. dawn ～ Good Evening, Narvik.flac',
    '10 attack (Boss Battle, Event).mp3.flac',
    '10 Four Thousand Years (Kriden Plains, Celbus Plains (Night)).mp3.flac',
    '10 just climbing (Penine Forest, , Kriden Plains).mp3.flac',
    '10 The depth of winter (Land in the Depth of Winter (Night)).mp3.flac',
    '10. Beyond.flac',
    '11 Apparition (Tomb of the Hero).mp3.flac',
    '11 Dance ~ Celtic Edit (Ordinary Bar-room).mp3.flac',
    '11 LAPUTA (Event).mp3.flac',
    '11 my love (Event).mp3.flac',
    '11. Your Smile.flac',
    '12 Carnival town (Blue Coral Town (Midday)).mp3.flac',
    '12 Good Evening, Narvik (Narvik (NIght)).mp3.flac',
    '12 Night Breeze (Ryuusen Countryside (Night)).mp3.flac',
    '12 The Place Forbidden to Visit by Adults (Whispering Coast, Valencia Coast, Doppleganger Forest etc.).mp3.flac',
    '12. 紅唇.flac',
    '13 Bambooming (Bamboo Ravine (Midday)).mp3.flac',
    '13 Make a break to this! (Fight Club, Doppleganger Forest).mp3.flac',
    '13 Sleepless air (Blue Coral Town (Night)).mp3.flac',
    '13 Sweet Jungle (Kauru (NIght)).mp3.flac',
    '13. Come Rain or Come Shine.flac',
    '14 A World of Cloudy Skies (Whispering Coast, Valencia Coast, Kriden Plains, Celbus Plains).mp3.flac',
    '14 Daybreak (Kriden Plains, Penine Forest, Celbus Plains).mp3.flac',
    '14 Dive (Crystal Cave).mp3.flac',
    '14 Rolling Dice (Event) .mp3.flac',
    "15 Joshua's Mandolin (Event) .mp3.flac",
    '15 Red Eyes (Ruby Cave) .mp3.flac',
    "15 Rocking on a Heaven's Door (Event).mp3.flac",
    '15 Take a step forward (Kriden Plains, Penine Forest).mp3.flac',
    '16 Aqua pura (Erla Island (Midday)) .mp3.flac',
    '16 Celtician (Magnolia Wine Show Event[Event) .mp3.flac',
    '16 Fortune Message (Whispering Coast, Valencia Coast).mp3.flac',
    '16 MidNight (Portal Area).mp3.flac',
    '17 Beach Wandering Boy (Whispering Coast, Valencia Coast).mp3.flac',
    '17 Sea star (Erla Island (Night)) .mp3.flac',
    '17 Sentence (Event).mp3.flac',
    '17 Song of Beach (Valencia Plains, Whispering Coast).mp3.flac',
    '18 Come with happiness (Raidia (Midday)).mp3.flac',
    '18 Serious Conspiracy (Event).mp3.flac',
    '18 So Cool (Event).mp3.flac',
    '18 The times forgotten (Erlarium Dungeon).mp3.flac',
    '19 Arab Dealer (Cardiff (Night)).mp3.flac',
    '19 Life in Keltica (keltica (Midday)).mp3.flac',
    '19 Surprise Rush (Event).mp3.flac',
    '19 Walking on your own (Kriden Plains, Celbus Plains ).mp3.flac',
    '20 Black Snake (Desert Field).mp3.flac',
    '20 Dawn, and the Moment of Awakening (Cave of Chaos).mp3.flac',
    '20 Good Morning Tian (Portal Area).mp3.flac',
    '20 Your mejesty (Anomarad Royal Castle Interior) .mp3.flac',
    '21 Apparition Re-Mix (Tomb of the Hero).mp3.flac',
    '21 chroyama (Glinz Mine) .mp3.flac',
    '21 real world (Kriden Plains,Celbus Plains, Penine Forest,).mp3.flac',
    '21 The occult (Anomarad Royal Castle Laboratory).mp3.flac',
    '22 A Tiny Chest Which Cannot Be Opened (Event).mp3.flac',
    '22 Final Killer (Event).mp3.flac',
    '22 La redoute (Fontina House) .mp3.flac',
    '22 The Good Old Days (Event).mp3.flac',
    "23 groovin' tonight (arrange ver.) (Kriden Plains).mp3.flac",
    '23 Noblesse (Keltica Town Noble Neighborhood (Midday)).mp3.flac',
    "23 Park's Life (Paku's ver.) (Event - Houhige Team) .mp3.flac",
    '23 yeah! (Cave of Chaos).mp3.flac',
    '24 A Song that Invites Happiness (Raidia (Night)).mp3.flac',
    '24 Aquabelle (Portal Area).mp3.flac',
    '24 Dance of feathers (Keltica Town Noble Neighborhood (Night)).mp3.flac',
    '24 East Green wind (Ryuusen Countryside (Midday)).mp3.flac',
    '25 magnolia (Magnolia Wine) .mp3.flac',
    "25 One Day (Keltica Town Citizen's Neighborhood (Midday)).mp3.flac",
    '25 Shadow Claws (Bamboo Ravine (Night)).mp3.flac',
    '25 Steppers on line (Penine Forest, Kriden Plains, Celbus Plains).mp3.flac',
    "26 And,Don't Forget (Keltica Town Citizen's Neighborhood (Night)).mp3.flac",
    '26 F.M.7 (Kriden Plains, Celbus Plains).mp3.flac',
    '26 keep yourself (Underwater Cave).mp3.flac',
    '26 Tower (Tower of Requiem).mp3.flac',
    '27 dawn (Cave of Spring).mp3.flac',
    '27 Lucky Guy (Panozare Coast (Midday)).mp3.flac',
    '27 Philaion (Philaion Dungeon) .mp3.flac',
    '27 Tropical Tripper (Portal Area).mp3.flac',
    '28 Cursed Mansion (Event) .mp3.flac',
    '28 Dark Knight (Panozare Coast(Night)) .mp3.flac',
    '28 delight (Valencia Plains, Whispering Coast).mp3.flac',
    '28 Urban lazy groove goes on (Celbus Plains).mp3.flac',
    '29 Chonan Gang (Doppleganger Forest).mp3.flac',
    '29 City of Trade (Cardiff (Midday)).mp3.flac',
    '29 Get Over (Keltica Outskirts Forest (Midday)).mp3.flac',
    '29 Orange Garage (Cave of Chaos).mp3.flac',
    '30 Hotel Inside (Adosel).mp3.flac',
    '30 In Grief (Event) .mp3.flac',
    '30 in peace (Event).mp3.flac',
    '30 Reminiscence (Keltica Outskirts Forest (Night)).mp3.flac',
    '31 Beyond (English ver.) (Ending Movie).mp3.flac',
    '31 dis-apparition (Shinop Dungeon).mp3.flac',
    '31 Doorway to an Ancient Civilization (Gold Sand Dungeon).mp3.flac',
    '31 indelight (Event).mp3.flac',
    '32 Battle in the Tomb of Hero - Z80 mix - (Tomb of the Hero).mp3.flac',
    '32 Flag Tournament (Flag Get).mp3.flac',
    '32 Success! (Chapter Clear!).mp3.flac',
    '33 Not Ended Fantasy (real-GT ver.) (Staff Roll).mp3.flac',
    '33 Stage Clear (Stage Clear!).mp3.flac',
    '33 What Exists In Order to Forget the Dreams of Yesterday (Event) .mp3.flac',
    '34 Apparition (Orchestra ver.) (3D Movie Opening).mp3.flac',
    '34 Weaver Once Again (Death (Swoon).mp3.flac',
    '35 Into the Divine (Ending Movie).mp3.flac',
    'Third Run.mp3',
  ]
}
