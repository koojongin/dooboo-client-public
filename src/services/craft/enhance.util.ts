export const getValueByScrollPercentString = (value: string) => {
  if (value === 'hundred') return 100
  if (value === 'sixty') return 60
  if (value === 'ten') return 10
  throw new Error('설정되지 않은 주문서 확률')
}
