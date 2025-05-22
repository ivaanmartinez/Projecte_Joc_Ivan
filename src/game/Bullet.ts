export class Bullet extends Phaser.Physics.Arcade.Sprite {
  speed = 400;
  
  constructor(scene: Phaser.Scene, x: number, y: number, direction: number) {
    super(scene, x, y, "bullet");
    
    // Añadir la bala a la escena
    scene.add.existing(this);
    
    // Habilitar física
    scene.physics.add.existing(this);
    
    // Configurar la bala
    this.setOrigin(0.5, 0.5);
    this.setScale(0.7);
    
    // Establecer la dirección visual
    this.flipX = direction < 0;
    
    // IMPORTANTE: Desactivar gravedad de múltiples maneras para asegurar que funcione
    if (this.body) {
      // Método 1: Desactivar gravedad directamente en el cuerpo
      (this.body as Phaser.Physics.Arcade.Body).allowGravity = false;
      
      // Método 2: Establecer gravedad a cero
      (this.body as Phaser.Physics.Arcade.Body).gravity.set(0, 0);
      
      // Método 3: Establecer velocidad Y a cero para mantenerla constante
      (this.body as Phaser.Physics.Arcade.Body).setVelocity(direction * this.speed, 0);
      
      // Método 4: Fijar la posición Y para que no cambie
      (this.body as Phaser.Physics.Arcade.Body).immovable = true;
    }
    
    // Añadir rotación para efecto visual
    scene.tweens.add({
      targets: this,
      angle: direction > 0 ? 360 : -360,
      duration: 1000,
      repeat: -1
    });
    
    // Auto-destruir después de 2 segundos
    scene.time.delayedCall(2000, () => {
      this.destroy();
    });
  }
  
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    
    // IMPORTANTE: Mantener la posición Y constante en cada actualización
    if (this.body && this.body.velocity.y !== 0) {
      this.body.velocity.y = 0;
    }
    
    // Destruir si sale de los límites del mundo
    if (this.x < 0 || this.x > this.scene.physics.world.bounds.width ||
        this.y < 0 || this.y > this.scene.physics.world.bounds.height) {
      this.destroy();
    }
  }
}
