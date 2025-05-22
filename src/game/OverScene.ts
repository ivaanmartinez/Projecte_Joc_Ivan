import * as Phaser from "phaser"

export class OverScene extends Phaser.Scene {
  constructor() {
    super("GameOver")
  }

  create() {
    // Fondo
    const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xaa0000)
    bg.setOrigin(0, 0)

    // Texto de game over
    const gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, "GAME OVER", {
      fontSize: "64px",
      color: "#ffffff",
      fontStyle: "bold",
    })
    gameOverText.setOrigin(0.5)

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
      "Intentar de nuevo",
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
      targets: gameOverText,
      scale: 1.2,
      duration: 500,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    })
  }
}
