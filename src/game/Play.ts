import * as Phaser from "phaser"
import { Level } from "./Level"
import type { Hero } from "./Hero"
import type { Spider } from "./Spider"
import { Animations } from "./Animations"

const LEVEL_COUNT = 2

export class Play extends Phaser.Scene {
  currentLevel = 1
  level: Level | undefined
  hero: Hero | undefined
  key: any
  door: any
  keyIcon: any
  coinIcon: any
  spiders: Spider[] | undefined

  groups: { [key: string]: Phaser.Physics.Arcade.Group } | undefined

  scoreText: Phaser.GameObjects.BitmapText | undefined

  score = 0
  hasKey = false
  lifeIcons: Phaser.GameObjects.Image[] = []

  animations: Animations | undefined

  constructor() {
    super("Play")
  }

  create() {
    console.log("Play.create()")

    // Obtener el nivel actual del registro (por defecto nivel 1)
    this.currentLevel = this.registry.get("currentLevel") || 1

    this.initAnimations()
    this.initLevel()
    this.initCamera()
    this.initPhysics()
    this.initScore()

    // Configurar la física global para las balas
    this.physics.world.on("worldbounds", (body) => {
      // Si una bala toca los límites del mundo, destruirla
      if (body.gameObject && body.gameObject.texture.key === "bullet") {
        body.gameObject.destroy()
      }
    })
  }

  update() {
    if (this.hero) {
      this.hero.update()
    }

    if (this.spiders) {
      this.spiders.forEach((spider) => spider.update())
    }

    const frame = this.hasKey ? 1 : 0
    this.keyIcon.setFrame(frame)
  }

  initAnimations() {
    this.animations = new Animations(this)
  }

  initLevel() {
    this.level = new Level(this)

    this.loadLevel(this.currentLevel)

    const props = ["hero", "key", "keyIcon", "coinIcon", "door", "spiders", "groups"]

    if (this.level) {
      props.forEach((prop) => (this[prop] = this.level![prop]))
    }

    this.lifeIcons = this.level.lifeIcons
    this.updateLifeDisplay()
  }

  initCamera() {
    this.cameras.main.setBounds(0, 0, 960, 600)
    this.cameras.main.flash()
  }

  initPhysics() {
    if (this.hero && this.level?.platforms) {
      this.physics.add.collider(this.hero, this.level.platforms)
    }
    if (this.groups?.spiders && this.level?.platforms) {
      this.physics.add.collider(this.groups.spiders, this.level.platforms)
    }
    if (this.groups?.spiders && this.groups?.enemyWalls) {
      this.physics.add.collider(this.groups.spiders, this.groups.enemyWalls)
    }

    if (this.hero && this.groups?.coins) {
      this.physics.add.overlap(this.hero, this.groups.coins, this.collectCoin, undefined, this)
    }

    if (this.hero && this.groups?.spiders) {
      this.physics.add.overlap(this.hero, this.groups.spiders, this.doBattle, undefined, this)

      if (this.hero.bullets) {
        this.physics.add.overlap(this.hero.bullets, this.groups.spiders, this.bulletHitSpider, undefined, this)
      }
    }

    if (this.hero && this.level?.platforms && this.hero.bullets) {
      this.physics.add.collider(this.hero.bullets, this.level.platforms, this.bulletHitPlatform, undefined, this)
    }

    if (this.hero && this.key) {
      this.physics.add.overlap(this.hero, this.key, this.collectKey, undefined, this)
    }

    if (this.hero && this.door) {
      this.physics.add.overlap(
        this.hero,
        this.door,
        this.exitThroughDoor,
        (hero, door) => this.hasKey && hero.body.touching.down,
        this,
      )
    }
  }

  initScore() {
    this.scoreText = this.add.bitmapText(
      this.coinIcon.x + this.coinIcon.width + 5,
      15,
      "font:numbers",
      `X${this.score}`,
    )
  }

  getAnimations(key: string) {
    return this.animations ? this.animations.getAnimations(key) : undefined
  }

  doBattle(hero, spider) {
    if (spider.body.touching.up && hero.body.touching.down) {
      this.sound.play("sfx:stomp")
      spider.die()
    } else {
      if (hero.loseLife()) {
        this.updateLifeDisplay()
      } else {
        this.gameOver()
      }
    }
  }

  bulletHitSpider(bullet, spider) {
    // Crear efecto de impacto
    const impactX = bullet.x
    const impactY = bullet.y

    // Partículas de impacto
    for (let i = 0; i < 5; i++) {
      const particle = this.add.circle(impactX, impactY, 2, 0xffff00)
      this.tweens.add({
        targets: particle,
        x: impactX + Phaser.Math.Between(-20, 20),
        y: impactY + Phaser.Math.Between(-20, 20),
        alpha: 0,
        scale: 0,
        duration: 300,
        ease: "Power2",
        onComplete: () => particle.destroy(),
      })
    }

    // Destruir la bala
    bullet.destroy()

    // Matar a la araña con efecto
    this.sound.play("sfx:stomp", { volume: 0.8 })
    spider.die()

    // Añadir más puntos por disparo
    this.score += 10
    if (this.scoreText) {
      this.scoreText.text = `X${this.score}`
    }

    // Efecto de cámara más intenso
    this.cameras.main.shake(150, 0.02)

    // Flash de pantalla
    this.cameras.main.flash(100, 255, 255, 0)
  }

  bulletHitPlatform(bullet, platform) {
    // Destruir la bala
    bullet.destroy()
  }

  updateLifeDisplay() {
    if (this.hero) {
      for (let i = 0; i < this.lifeIcons.length; i++) {
        this.lifeIcons[i].setVisible(i < this.hero.lives)
      }
    }
  }

  exitThroughDoor(hero, door) {
    this.sound.play("sfx:door")
    this.gotoNextLevel()
  }

  collectKey(hero, key) {
    key.destroy()
    this.sound.play("sfx:key")
    this.hasKey = true
  }

  collectCoin(hero, coin) {
    coin.destroy()
    this.sound.play("sfx:coin")
    this.score += 1
    if (this.scoreText) {
      this.scoreText.text = `X${this.score}`
    }
  }

  reset() {
    this.score = 0
    this.hasKey = false
    this.currentLevel = 1
    this.registry.set("currentLevel", 1)
    this.registry.set("score", 0)
    this.registry.set("hasKey", false)
    if (this.hero) {
      this.hero.lives = 3
    }
    this.updateLifeDisplay()
  }

  gotoNextLevel() {
    // Verificar si acabamos de completar el último nivel
    if (this.currentLevel >= LEVEL_COUNT) {
      // ¡Has ganado! Ir a la pantalla de victoria
      this.registry.set("score", this.score)
      this.registry.set("currentLevel", this.currentLevel)

      this.cameras.main.fade(1000)
      this.cameras.main.on("camerafadeoutcomplete", (camera, effect) => {
        this.scene.start("Victory")
      })
      return
    }

    // Si no hemos completado todos los niveles, ir al siguiente
    this.hasKey = false // Solo resetear la llave, mantener puntuación y vidas
    this.currentLevel = this.currentLevel + 1
    this.registry.set("currentLevel", this.currentLevel)

    this.cameras.main.fade(1000)
    this.cameras.main.on("camerafadeoutcomplete", (camera, effect) => {
      this.scene.start("Play")
    })
  }

  loadLevel(level: number) {
    if (this.level) {
      this.level.loadLevel(this.cache.json.get(`level:${level}`))
    }
  }

  gameOver() {
    // Guardar la puntuación para la pantalla de game over
    this.registry.set("score", this.score)

    if (this.hero) {
      this.hero.die()
    }

    this.cameras.main.fade(1000)
    this.cameras.main.on("camerafadeoutcomplete", (camera, effect) => {
      this.scene.start("GameOver")
    })
  }
}
