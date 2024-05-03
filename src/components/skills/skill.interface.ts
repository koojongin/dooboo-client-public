export interface SkillIconNode extends FlowNodeType {
  data: SkillIconData
}
export interface SkillIconData {
  src: string
  isLearned?: boolean
}

export interface FlowNodeType {
  id: string
  type: string
  position: { x: number; y: number }
}
