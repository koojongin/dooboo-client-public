export interface ConnectedCharacter {
  characterId: string
  exp: number
  iat: number
  nickname: string
}

export interface ConnectedCharacterWrapper {
  [id: string]: ConnectedCharacter
}
