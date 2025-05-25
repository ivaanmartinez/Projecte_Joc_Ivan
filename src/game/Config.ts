import Phaser from "phaser"
import { Boot } from "./Boot"
import { Play } from "./Play"
import { OverScene } from "./OverScene"
import { VictoryScene } from "./VictoryScene"

export var gameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 600,
  roundPixels: true,
  backgroundColor: 0x000000,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      // debug: true,
    },
  },
  scene: [Boot, Play, OverScene, VictoryScene],
}
