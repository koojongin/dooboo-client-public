import createKey from '@/services/key-generator'
import { translate } from '@/services/util'
import { CardOption } from '@/interfaces/gatcha.interface'

export function SummpedCardOptions({ options }: { options: CardOption[] }) {
  return (
    <>
      {options.map((option) => {
        return (
          <div
            key={createKey()}
            className="ff-score-all font-bold flex justify-between"
          >
            <div className="text-[14px] min-w-[300px]">
              {translate(`card:option:${option.name}`)}
            </div>
            <div className="text-[14px]">{option.value}</div>
          </div>
        )
      })}
    </>
  )
}
