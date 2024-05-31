export const EMIT_CHAT_MESSAGE_EVENT = 'chat-message'
export const ON_CHAT_MESSAGE_EVENT = 'chat-message'
export const EMIT_CHAT_JOIN_EVENT = 'chat-join'
export const ON_CHAT_JOIN_EVENT = 'chat-join'

export const EMIT_GET_CHARACTERS_EVENT = 'get-characters'
export const ON_GET_CHARACTERS_EVENT = 'get-characters'

export const EMIT_SHARE_ITEM_EVENT = 'share-item'
export const ON_SHARE_ITEM_EVENT = 'share-item'
export const EMIT_SHARE_GOLD_BOX_RESULT_EVENT = 'share-gold-box-result'
export const ON_SHARE_GOLD_BOX_RESULT_EVENT = 'share-gold-box-result'

export const EMIT_CHAT_EMOJI_EVENT = 'chat-emoji'
export const ON_CHAT_EMOJI_EVENT = 'chat-emoji'

export const EMIT_NOTICE_MESSAGE_EVENT = 'notice'
export const ON_NOTICE_MESSAGE_EVENT = 'notice'
export const EMIT_ENHANCED_LOG_MESSAGE_EVENT = 'share-enhanced-log'
export const ON_ENHANCED_LOG_MESSAGE_EVENT = 'share-enhanced-log'

export const EMIT_PICKUP_LOG_MESSAGE_EVENT = 'share-pickup-log'
export const ON_PICKUP_LOG_MESSAGE_EVENT = 'share-pickup-log'

export const MESSAGE_EVENT = 'message'

export enum MessageType {
  System = 'system',
  Normal = 'normal',
  ItemShare = 'item-share',
  Emoji = 'emoji',
  Notice = 'notice',
  EnhancedLog = 'enhanced-log',
  PickUpLog = 'pickup-log',
  GoldBoxResultShare = 'gold-box-result-share',
  RaidOpen = 'raid-open',
}
