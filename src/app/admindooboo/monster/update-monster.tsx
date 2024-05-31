'use client'

import { Button, Card, Input, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { fetchPutMonster } from '@/services/api-fetch'
import { Monster } from '@/interfaces/monster.interface'
import toAPIHostURL from '@/services/image-name-parser'

export default function UpdateMonsterForm({
  selectedMonster,
  handleClose,
}: {
  selectedMonster: Monster
  handleClose: any
}) {
  const [name, setName] = useState('')
  const [hp, setHp] = useState(0)
  const [experience, setExperience] = useState(0)
  const [gold, setGold] = useState(0)
  const [weight, setWeight] = useState(0)

  useEffect(() => {
    setName(selectedMonster.name)
    setHp(selectedMonster.hp)
    setExperience(selectedMonster.experience)
    setGold(selectedMonster.gold)
    setWeight(selectedMonster.weight)
  }, [selectedMonster])
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
  const onSubmit = async () => {
    // return handleRefreshMonsterList()
    const validationMessage = checkValidation()

    if (validationMessage) {
      return Swal.fire({
        title: validationMessage,
        text: '모든 정보를 입력하세요.',
        icon: 'error',
        confirmButtonText: '확인',
      })
    }
    const monster = {
      _id: selectedMonster._id,
      name,
      hp,
      experience,
      gold,
      weight,
    }

    const result = await fetchPutMonster(monster)
    const { monster: rMonster } = result

    handleClose(true)

    setName('')
    setHp(0)
    setExperience(0)
    setGold(0)
    setWeight(0)

    await Swal.fire({
      title: '수정되었습니다',
      text: rMonster.name,
      icon: 'success',
      confirmButtonText: '확인',
    })
  }

  return (
    <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        몬스터 수정
      </Typography>
      <div className="flex justify-center">
        <img src={toAPIHostURL(selectedMonster.thumbnail)} />
      </div>
      <form className="mt-8 mb-2 w-full max-w-screen-lg" onSubmit={onSubmit}>
        <div className="mb-1 flex flex-col gap-3">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            몬스터 이름
          </Typography>
          <Input
            value={name}
            onChange={(event: any) => setName(event?.target?.value)}
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
            value={hp}
            type="number"
            onChange={(event: any) => setHp(event?.target?.value)}
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
            value={experience}
            onChange={(event: any) => setExperience(event?.target?.value)}
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
            value={gold}
            type="number"
            onChange={(event: any) => setGold(event?.target?.value)}
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
    </Card>
  )
}
