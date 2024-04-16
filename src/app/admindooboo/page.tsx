'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminMainPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/admindooboo/monster')
  }, [router])

  return <div>Ready...</div>
}
