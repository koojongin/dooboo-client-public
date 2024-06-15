'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'

export default function GoogleAnalyticsComponent() {
  const pathname = usePathname()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) {
      ReactGA.send({ hitType: 'pageview', page: pathname })
    }
  }, [initialized, pathname])

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA) {
      ReactGA.initialize(process.env.NEXT_PUBLIC_GA)
      setInitialized(true)
    }
  }, [])

  return <></>
}
