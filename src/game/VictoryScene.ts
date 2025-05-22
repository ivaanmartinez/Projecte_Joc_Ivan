import * as Phaser from "phaser"

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super("Victory")
  }

  create() {
    // Fondo
    const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x00aa00)
    bg.setOrigin(0, 0)

    // Texto de victoria
    const victoryText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, "¡VICTORIA!", {
      fontSize: "64px",
      color: "#ffffff",
      fontStyle: "bold",
    })
    victoryText.setOrigin(0.5)

    // Puntuación
    const score = this.registry.get("score") || 0
    const scoreText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 30,
      `Puntuación: ${score}`,
      {
        fontSize: "32px",
        color: "#ffffff",
      },
    )
    scoreText.setOrigin(0.5)

    // Botón para reiniciar
    const restartButton = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 100,
      "Jugar de nuevo",
      {
        fontSize: "24px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      },
    )
    restartButton.setOrigin(0.5)
    restartButton.setInteractive({ useHandCursor: true })

    // Efecto hover
    restartButton.on("pointerover", () => {
      restartButton.setTint(0xffff00)
    })

    restartButton.on("pointerout", () => {
      restartButton.clearTint()
    })

    // Reiniciar juego al hacer clic
    restartButton.on("pointerdown", () => {
      this.scene.start("Play")
    })

    // Animación de entrada
    this.tweens.add({
      targets: [victoryText, scoreText],
      y: "-=20",
      duration: 1000,
      ease: "Bounce",
      yoyo: true,
      repeat: -1,
    })
  }
}
