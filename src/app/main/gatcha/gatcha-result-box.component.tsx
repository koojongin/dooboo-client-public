import createKey from '@/services/key-generator'

export function GatchaResultBoxComponent({ cards }: { cards: any[] }) {
  const getShadowBackground = (starForce: number) => {
    if (starForce === 3)
      return 'linear-gradient(to top, rgb(211 225 250 / 0.2), rgb(245 228 252 / 0.65) 20%, rgb(250 250 250 / 0.9) 40%, rgb(255 255 255 / 1) 50%, rgb(250 250 250 / 0.9) 60%, rgb(245 228 252 / 0.65) 80%, rgb(211 225 250 / 0.2))'
    if (starForce === 2)
      return 'linear-gradient(to top, rgb(211 225 250 / 0.2), rgb(242 249 211 / 65%) 20%, rgb(250 250 250 / 0.9) 40%, rgb(255 255 255 / 1) 50%, rgb(250 250 250 / 0.9) 60%, rgb(250 252 228 / 65%) 80%, rgb(211 225 250 / 0.2))'
    return ''
  }

  const getBoxShadow = (starForce: number) => {
    if (starForce === 3) return '0 4px 4px 1px #c5a7ee, 0 0 5px 4px #fadbed'
    if (starForce === 2)
      return 'rgb(243, 231, 173) 1px 1px 0 1px, rgb(255, 251, 184) 0px 0px 1px 1px'
    return ''
  }

  const getCharacterBackground = (starForce: number) => {
    if (starForce === 3) return 'rgb(249 195 219/0.85)'
    if (starForce === 2) return 'rgb(252 245 120/90%)'
    return ''
  }
  return (
    <div
      className="w-[1000px] relative h-[500px] flex items-center justify-center"
      style={{ background: `url('/images/pickup/background.png')` }}
    >
      <div className="absolute w-full h-[350px] flex flex-wrap items-center justify-center px-[100px]">
        {cards.map((card) => {
          const background = getShadowBackground(card.starForce)
          return (
            <div
              key={createKey()}
              className="h-[120px] w-[120px] flex items-center my-[25px] mx-[15px] skew-x-[-10deg]"
            >
              <div
                className="absolute w-[120px] h-[200px] animate-cardIdle"
                style={{
                  background,
                }}
              />
            </div>
          )
        })}
      </div>
      <div className="px-[100px] w-full relative rounded flex flex-wrap justify-center items-center [&>div]:w-[120px] [&>div]:h-[120px]">
        {cards.map((card) => {
          const boxShadow = getBoxShadow(card.starForce)
          const characterBackground = getCharacterBackground(card.starForce)
          return (
            <div
              key={createKey()}
              style={{
                // transform: 'skewX(10deg)',
                boxShadow,
                backgroundImage: `url('/images/pickup/background.png')`,
                backgroundPosition: 'top',
                backgroundSize: 'cover',
              }}
              className="relative overflow-hidden rounded my-[25px] mx-[15px] skew-x-[-10deg]"
            >
              <div
                className="border border-2 border-white h-full overflow-hidden relative"
                style={{
                  background: characterBackground,
                }}
              >
                <div
                  className="absolute w-full h-full bg-center"
                  style={{
                    zIndex: 1,
                    backgroundImage: `url('/images/pickup/card-bg.png')`,
                  }}
                />
                <img
                  src={card.thumbnail}
                  className="skew-x-[10deg] z-[2] relative"
                />
                <div className="flex bg-white/90 items-center justify-center ff-ba text-[16px] h-[22px]">
                  {new Array(card.starForce).fill(1).map(() => (
                    <img
                      key={createKey()}
                      className="w-[16px] h-[16px] skew-x-[10deg]"
                      src="/images/star_on.png"
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
