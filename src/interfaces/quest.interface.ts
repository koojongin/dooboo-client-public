import { MongooseDocument, Pagination } from '@/interfaces/common.interface'

export interface BaseQuestListResponse extends Pagination {
  baseQuests: BaseQuest[]
}

export interface QuestListResponse extends Pagination {
  quests: Quest[]
}
export interface BaseQuest extends MongooseDocument {
  name: string
  desc: string
  reqLevel: number
  reqJob: string[]

  quest?: Quest
}

export interface Quest extends MongooseDocument {
  baseQuest: BaseQuest
  snapshot: object
  isCompleted: boolean
  completedAt: string
}

export enum QuestPageMenuType {
  All = 'All',
  Running = 'Running',
  Completed = 'Completed',
}
