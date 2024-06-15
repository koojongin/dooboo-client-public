export const pickByRate = (rate: number) => {
  const compensateValue = 10000
  return (
    Math.floor(Math.random() * ((100 + 1) * compensateValue)) <=
    compensateValue * rate
  )
}

export const pickByRoll = (roll: number) => {
  if (roll <= 0) return true
  const result = parseInt(String(Math.random() * roll), 10) + 1 === 1
  return result
}
