import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: any
  }
}

function GoogleAd() {
  useEffect(() => {
    setTimeout(() => {
      window.adsbygoogle = window?.adsbygoogle || []
      if (
        typeof window.adsbygoogle === 'object' &&
        window.adsbygoogle.length >= 0
      )
        window.adsbygoogle.push({})
    }, 1000)
  }, [])

  return (
    <div className="googleAd-container">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3170005754524045"
        data-ad-slot="3939909034"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

export default GoogleAd
