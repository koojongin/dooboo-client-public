'use client'

import { Card, CardBody } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { fetchGetDropTableList } from '@/services/api-fetch'

export default function DropPage() {
  const [dropTables, setDropTables] = useState<any[]>([])
  const loadDropTables = async () => {
    const { dropTables: rDropTables } = await fetchGetDropTableList()
    setDropTables(rDropTables)
  }

  useEffect(() => {
    loadDropTables()
  }, [])
  return (
    <Card>
      <CardBody>
        <h1>드랍테이블</h1>
        <div>
          {dropTables.map((dropTable) => {
            return <div key={dropTable._id}>{dropTable._id}</div>
          })}
        </div>
      </CardBody>
    </Card>
  )
}
