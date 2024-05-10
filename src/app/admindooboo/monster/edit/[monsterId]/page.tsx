'use client'

import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  Input,
  Typography,
} from '@material-tailwind/react'
import Swal from 'sweetalert2'
import moment from 'moment'
import { fetchGetMonster, fetchPutMonster } from '@/services/api-fetch'
import { Monster } from '@/interfaces/monster.interface'
import toAPIHostURL from '@/services/image-name-parser'

export default function Page({
  params,
  searchParams,
}: {
  params: { monsterId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { monsterId } = params

  const [monster, setMonster] = useState<Monster>()

  const [name, setName] = useState('')
  const [hp, setHp] = useState(0)
  const [experience, setExperience] = useState(0)
  const [gold, setGold] = useState(0)
  const [weight, setWeight] = useState(0)

  const checkValidation = () => {
    let validationMessage = ''
    if (name.length < 2) {
      validationMessage = '이름을 입력하세요. 최소 2자'
      return validationMessage
    }
    if (hp <= 0) {
      validationMessage = '체력을 0보다 높게 설정하세요.'
      return validationMessage
    }
    if (gold < 0) {
      validationMessage = '0골드 아래로 입력 불가'
      return validationMessage
    }
    if (experience < 1) {
      validationMessage = '경험치는 최소 1이어야합니다'
      return validationMessage
    }
    if (weight < 1) {
      validationMessage = '무게는 최소 1이어야 합니다.'
      return validationMessage
    }

    return validationMessage
  }

  const loadMonster = async (id: string) => {
    const { monster: rMonster } = await fetchGetMonster(id)
    setMonster(rMonster)
    setName(rMonster.name)
    setHp(rMonster.hp)
    setExperience(rMonster.experience)
    setGold(rMonster.gold)
    setWeight(rMonster.weight)
  }

  const onSubmit = async () => {
    // if (monster) await loadMonster(monster._id)

    const validationMessage = checkValidation()

    if (validationMessage) {
      return Swal.fire({
        title: validationMessage,
        text: '모든 정보를 입력하세요.',
        icon: 'error',
        confirmButtonText: '확인',
      })
    }
    const newMonster = {
      _id: monsterId,
      name,
      hp,
      experience,
      gold,
      weight,
    }

    const result = await fetchPutMonster(newMonster)
    const { monster: rMonster } = result

    await Swal.fire({
      title: '수정되었습니다',
      text: rMonster.name,
      icon: 'success',
      confirmButtonText: '확인',
    })

    await loadMonster(monsterId)
  }

  useEffect(() => {
    loadMonster(monsterId)
  }, [])

  return (
    <div>
      {monster && (
        <Card className="flex">
          <CardBody>
            <Typography variant="h4" color="blue-gray">
              몬스터 수정
              {` ${moment(monster.updatedAt).format('YYYY-MM-DD HH:mm:ss')}`}
            </Typography>
            <div className="flex justify-center w-[100px]">
              <img
                className="w-full h-full"
                src={toAPIHostURL(monster.thumbnail)}
              />
            </div>
            <form onSubmit={onSubmit}>
              <div className="mb-1 flex flex-col gap-3">
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  몬스터 이름
                </Typography>
                <Input
                  // disabled
                  onChange={(event: any) => setName(event?.target?.value)}
                  value={name}
                  size="md"
                  placeholder="몬스터이름..."
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
                />
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  체력
                </Typography>
                <Input
                  // disabled
                  value={hp}
                  onChange={(event: any) => setHp(event?.target?.value)}
                  type="number"
                  size="md"
                  placeholder="100"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
                />

                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  획득 경험치
                </Typography>
                <Input
                  // disabled
                  onChange={(event: any) => setExperience(event?.target?.value)}
                  value={experience}
                  type="number"
                  size="md"
                  placeholder="5"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
                />

                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  획득 골드
                </Typography>
                <Input
                  // disabled
                  onChange={(event: any) => setGold(event?.target?.value)}
                  value={gold}
                  type="number"
                  size="md"
                  placeholder="10"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
                />

                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  무게
                </Typography>
                <Input
                  // disabled
                  value={weight}
                  onChange={(event: any) => setWeight(event?.target?.value)}
                  size="md"
                  type="number"
                  placeholder="100"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
                />
              </div>
              <Button
                className="mt-6 text-md"
                size="sm"
                fullWidth
                onClick={() => onSubmit()}
              >
                수정
              </Button>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
