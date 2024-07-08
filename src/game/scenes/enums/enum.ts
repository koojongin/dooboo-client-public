export enum CollisionCategory {
  Monster = 1,
  Weapon = 2,
}

export enum Resource {
  SwingKey = 'swing',
  SwingAnimationPath = '/game-resources/motion/swing/swing_anim',
  SwingSpriteSheetPath = '/game-resources/motion/swing/swing.png',
  SwingAtlasPath = '/game-resources/motion/swing/swing_atlas.json',

  SkillsKey = 'skills',
  SkillsAnimationPath = '/game-resources/motion/skills/skills_anim',
  SkillsSpriteSheetPath = '/game-resources/motion/skills/skills.png',
  SkillsAtlasPath = '/game-resources/motion/skills/skills_atlas.json',
}

export enum AnimationKey {
  Stabtf = 'stabtf',
  Swingpf = 'swingpf',
  Stand1 = 'stand1',
  Walk2 = 'walk2',
  Strike = 'strike',
  FireWall = 'fire-wall',
}

export enum SoundKey {
  WeaponDrop = 'weapon-drop',
  EtcDrop = 'etc-drop',
}

export enum GameEvent {
  MonsterDead = 'MonsterDead',
  DropItem = 'DropItem',
  OnDamagedMonster = 'OnDamagedMonster',
  PlayerDead = 'PlayerDead',
  OnGameStop = 'OnGameStop',
}

export enum GameConfig {
  QueueResolveTime = 1000 * 30,
  Version = 4,
  CROW_PRESERVE_TIME = 1000 * 15,
}
