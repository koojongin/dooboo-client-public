import api from '@/services/api'
import { CardSetCategory } from '@/constants/cards.enum'
import { GatchaCard } from '@/interfaces/gatcha.interface'

export async function fetchGetCardSet(
  category: CardSetCategory,
): Promise<{ cardSet: GatchaCard[] }> {
  const { data: response } = await api.post(`/card/card-set`, { category })
  return response
}

export async function fetchPickUp(
  category: CardSetCategory,
  amount: number,
): Promise<{ cardSet: GatchaCard[] }> {
  const { data: response } = await api.post(`/card/pickup`, {
    amount,
    category,
  })
  return response
}

export async function fetchGetAllCardSet(): Promise<{ cardSet: GatchaCard[] }> {
  const { data: response } = await api.get(`/card/all`)
  return response
}

export async function fetchGetMyCardSet(): Promise<{ cardSet: GatchaCard[] }> {
  const { data: response } = await api.get(`/card/me`)
  return response
}

export async function fetchSaveDeck(
  cardNames: string[],
): Promise<{ cardSet: GatchaCard[] }> {
  const { data: response } = await api.post(`/card/save-deck`, { cardNames })
  return response
}

export async function fetchGetMyDeck(): Promise<{ cards: GatchaCard[] }> {
  const { data: response } = await api.get(`/card/my-deck`)
  return response
}

export async function fetchGetDeckByCharacter(
  characterId: string,
): Promise<{ cards: GatchaCard[] }> {
  const { data: response } = await api.get(`/card/deck/${characterId}`)
  return response
}

export async function fetchCardSet(
  characterId: string,
): Promise<{ cardSet: GatchaCard[] }> {
  const { data: response } = await api.get(`/card/character/${characterId}`)
  return response
}

export async function fetchGatchaPoints() {
  const { data: response } = await api.get(`/card/gatcha-points`)
  return response
}
export async function fetchGetGuarenteedPickUpCards(
  category: CardSetCategory,
): Promise<{ cards: GatchaCard[] }> {
  const { data: response } = await api.post(`/card/guaranteed-pickup-cards`, {
    category,
  })
  return response
}

export async function fetchPickUpGuarenteedCard(
  name: string,
  category: CardSetCategory,
) {
  const { data: response } = await api.post(`/card/pickup/guaranteed-card`, {
    name,
    category,
  })
  return response
}
