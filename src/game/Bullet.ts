export class Bullet extends Phaser.Physics.Arcade.Sprite {
  speed = 500
  direction: number

  constructor(scene: Phaser.Scene, x: number, y: number, direction: number) {
    super(scene, x, y, "bullet")

    this.direction = direction

    // Añadir la bala a la escena y física
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Configurar la bala
    this.setOrigin(0.5, 0.5)
    this.setScale(0.8)

    // Establecer la dirección visual
    this.flipX = direction < 0

    // CRÍTICO: Configurar el cuerpo físico correctamente
    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body

      // Desactivar completamente la gravedad
      body.setGravity(0, 0)
      body.allowGravity = false

      // Establecer velocidad constante
      body.setVelocity(direction * this.speed, 0)

      // Hacer que la bala no sea afectada por colisiones
      body.setImmovable(true)

      // Configurar el tamaño de colisión
      body.setSize(12, 4)
    }

    // Efecto visual de rotación
    this.scene.tweens.add({
      targets: this,
      angle: direction > 0 ? 360 : -360,
      duration: 800,
      repeat: -1,
      ease: "Linear",
    })

    // Auto-destruir después de 3 segundos
    this.scene.time.delayedCall(3000, () => {
      if (this.active) {
        this.destroy()
      }
    })
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    // Forzar que la bala mantenga su velocidad horizontal y Y = 0
    if (this.body && this.active) {
      const body = this.body as Phaser.Physics.Arcade.Body
      body.velocity.x = this.direction * this.speed
      body.velocity.y = 0
    }

    // Destruir si sale de los límites del mundo
    const bounds = this.scene.physics.world.bounds
    if (this.x < -50 || this.x > bounds.width + 50 || this.y < -50 || this.y > bounds.height + 50) {
      this.destroy()
    }
  }

  destroy() {
    // Limpiar tweens antes de destruir
    this.scene.tweens.killTweensOf(this)
    super.destroy()
  }
}
