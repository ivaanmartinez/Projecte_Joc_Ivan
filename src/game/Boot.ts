import Phaser from "phaser"
import level1 from "../data/level1.json"
import level2 from "../data/level2.json"

export class Boot extends Phaser.Scene {
  constructor() {
    super("Boot")
  }

  preload() {
    console.log("Boot.preload()")

    this.load.setCORS("crossOrigin")
    this.load.setBaseURL("https://ninja-code-club.s3.us-west-1.amazonaws.com/")

    this.load.json("level:1", level1)
    this.load.json("level:2", level2)

    this.load.image("font:numbers", "images/numbers.png")
    this.load.image("icon:coin", "images/coin_icon.png")
    this.load.image("icon:life", "images/life_icon.png")
    this.load.image("background", "images/background.png")
    this.load.image("invisible-wall", "images/invisible_wall.png")
    this.load.image("ground", "images/ground.png")
    this.load.image("grass:8x1", "images/grass_8x1.png")
    this.load.image("grass:6x1", "images/grass_6x1.png")
    this.load.image("grass:4x1", "images/grass_4x1.png")
    this.load.image("grass:2x1", "images/grass_2x1.png")
    this.load.image("grass:1x1", "images/grass_1x1.png")
    this.load.image("key", "images/key.png")

    this.load.spritesheet("decoration", "images/decor.png", {
      frameWidth: 42,
      frameHeight: 42,
    })
    this.load.spritesheet("hero", "images/hero.png", {
      frameWidth: 36,
      frameHeight: 42,
    })
    this.load.spritesheet("coin", "images/coin_animated.png", {
      frameWidth: 22,
      frameHeight: 22,
    })
    this.load.spritesheet("spider", "images/spider.png", {
      frameWidth: 42,
      frameHeight: 32,
    })
    this.load.spritesheet("door", "images/door.png", {
      frameWidth: 42,
      frameHeight: 66,
    })
    this.load.spritesheet("icon:key", "images/key_icon.png", {
      frameWidth: 34,
      frameHeight: 30,
    })

    this.load.audio("sfx:jump", "audio/jump.wav")
    this.load.audio("sfx:coin", "audio/coin.wav")
    this.load.audio("sfx:key", "audio/key.wav")
    this.load.audio("sfx:stomp", "audio/stomp.wav")
    this.load.audio("sfx:door", "audio/door.wav")
    this.load.audio("bgm", ["audio/bgm.mp3", "audio/bgm.ogg"])
  }

  create() {
    console.log("Boot.create()")

    // Crear una textura para las balas
    this.createBulletTexture()

    this.scene.start("Play")
  }

  createBulletTexture() {
    // Crear una textura más realista para las balas
    const graphics = this.add.graphics()

    // Cuerpo principal de la bala (dorado/bronce)
    graphics.fillStyle(0xdaa520)
    graphics.fillRoundedRect(0, 1, 10, 6, 1)

    // Punta de la bala (plateado)
    graphics.fillStyle(0xc0c0c0)
    graphics.fillTriangle(10, 2, 14, 4, 10, 6)

    // Casquillo trasero (más oscuro)
    graphics.fillStyle(0xb8860b)
    graphics.fillRect(0, 2, 2, 4)

    // Brillo superior
    graphics.fillStyle(0xffffff)
    graphics.fillRect(2, 2, 6, 1)

    // Línea de separación
    graphics.lineStyle(1, 0x8b4513)
    graphics.lineBetween(8, 1, 8, 7)

    // Generar la textura
    graphics.generateTexture("bullet", 16, 8)
    graphics.destroy()
  }
}
