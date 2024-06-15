export interface OnCollisionSprite extends Phaser.Physics.Arcade.Sprite {
  onCollision: (target: OnCollisionSprite) => void
  // onDamaged?: (target: OnCollisionSprite) => void
  onDamaged?: (data: any) => void
}
