import api from '@/services/api'
import { SkillKind } from '@/interfaces/skill.interface'

export async function fetchPutChangeActiveSkill(
  skillName: SkillKind,
): Promise<any> {
  const { data: response } = await api.put('/skill/change-active-skill', {
    name: skillName,
  })
  return response
}
