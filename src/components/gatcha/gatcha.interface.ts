import { CardSetCategory } from '@/constants/cards.enum'

export interface GuaranteedSelectDialogRef {
  refresh?: () => void
  open: (cardSetCategory: CardSetCategory) => void
}
