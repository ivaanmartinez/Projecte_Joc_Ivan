import Phaser from "phaser"
import type { Play } from "./Play"
import { Bullet } from "./Bullet"

export class Hero extends Phaser.Physics.Arcade.Sprite {
  keys: Phaser.Types.Input.Keyboard.CursorKeys | undefined
  animations: any
  dead = false
  lives = 3
  canShoot = true
  shootCooldown = 500
  bullets: Phaser.Physics.Arcade.Group | undefined

  constructor(scene: Play, x, y) {
    super(scene, x, y, "hero")
    this.animations = scene.getAnimations("hero")
    this.setOrigin(0.5, 0.5)
    this.initKeys(scene)

    // Crear grupo de balas con configuración específica
    this.bullets = scene.physics.add.group({
      classType: Bullet,
      maxSize: 15,
      runChildUpdate: true,
      allowGravity: false,
      immovable: true,
    })
  }

  update() {
    if (this.dead) return

    if (this.keys?.up?.isDown && this.body.touching.down) {
      this.jump()
    } else if (this.keys?.space?.isDown && this.canShoot) {
      this.shoot()
    } else if (this.keys?.left?.isDown) {
      this.runLeft()
    } else if (this.keys?.right?.isDown) {
      this.runRight()
    } else {
      this.halt()
    }

    const animationName = this.getAnimationName()
    if (this.anims.getName() !== animationName) {
      this.anims.play(animationName)
    }
  }

  die() {
    this.dead = true
    this.anims.play("dyingHero", true)
  }

  loseLife() {
    if (this.lives > 0) {
      this.lives--
      this.scene.tweens.add({
        targets: this,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: 5,
        onComplete: () => {
          this.alpha = 1
        },
      })
      return true
    }
    return false
  }

  runRight() {
    this.setVelocityX(160)
    this.flipX = false
  }

  runLeft() {
    this.setVelocityX(-160)
    this.flipX = true
  }

  halt() {
    this.setVelocityX(0)
  }

  jump() {
    this.setVelocityY(-330)
    this.scene.sound.play("sfx:jump")
  }

  shoot() {
    if (!this.canShoot || this.dead || !this.bullets) return

    // Determinar la dirección basada en la orientación del héroe
    const direction = this.flipX ? -1 : 1

    // Calcular la posición exacta desde donde sale la bala
    const offsetX = direction > 0 ? 25 : -25
    const offsetY = -5

    const bulletX = this.x + offsetX
    const bulletY = this.y + offsetY

    // Efecto de retroceso más pronunciado
    this.scene.tweens.add({
      targets: this,
      x: this.x - direction * 8,
      duration: 80,
      yoyo: true,
      ease: "Power2",
    })

    // Crear la bala
    const bullet = new Bullet(this.scene, bulletX, bulletY, direction)

    // Añadir al grupo
    this.bullets.add(bullet)

    // Efecto de flash al disparar
    this.scene.tweens.add({
      targets: this,
      alpha: 1.5,
      duration: 50,
      yoyo: true,
      ease: "Power1",
    })

    // Reproducir sonido de disparo (usando el sonido de salto por ahora)
    this.scene.sound.play("sfx:jump", {
      volume: 0.3,
      rate: 1.5, // Hacer el sonido más agudo para que suene como disparo
    })

    // Establecer cooldown
    this.canShoot = false
    this.scene.time.delayedCall(this.shootCooldown, () => {
      this.canShoot = true
    })
  }

  getAnimationName() {
    let name = this.animations.stop

    if (this.body.velocity.y > 0) {
      name = this.animations.jump
    } else if (this.body.velocity.y <= 0 && !this.body.touching.down) {
      name = this.animations.fall
    } else if (this.body.velocity.x !== 0 && this.body.touching.down) {
      name = this.animations.run
    }

    return name
  }

  private initKeys(scene) {
    this.keys = scene.input.keyboard.createCursorKeys()
    if (this.keys) {
      ;(this.keys as any).space = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }
  }
}
