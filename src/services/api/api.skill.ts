import api from '@/services/api'
import { SkillKind, SkillMeResponse } from '@/interfaces/skill.interface'

export async function fetchPutChangeActiveSkill(
  skillName: SkillKind,
): Promise<any> {
  const { data: response } = await api.put('/skill/change-active-skill', {
    name: skillName,
  })
  return response
}

export async function fetchCharacterSkill(
  characterId: string,
): Promise<SkillMeResponse> {
  const { data: response } = await api.get(`/skill/get/${characterId}`)
  return response
}
