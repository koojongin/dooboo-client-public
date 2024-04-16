import { Card } from '@material-tailwind/react'

export default function ProfileComponent({ borderStyle }: any) {
  return (
    <Card
      className={`col-span-1 flex justify-center items-center min-h-80 ${borderStyle}`}
    >
      <img src="/images/ako.webp" />
    </Card>
  )
}
