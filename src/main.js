import Scene from "./scenes/Scene.js";

class P extends Phaser.Scene {
    preload() {
        /**@type {Phaser.Types.Loader.FileTypes.ImageFrameConfig} */
        const spriteConfig = { frameWidth: 32, frameHeight: 32 };

        this.load.image('bg', 'assets/images/bg.png');
        this.load.spritesheet('p1-1', 'assets/images/p1-1.png', spriteConfig);
        this.load.spritesheet('p2-1', 'assets/images/p2-1.png', spriteConfig)
    }

    create() {
        this.anims.create({
            key: 'bounce-p1-1',
            frames: this.anims.generateFrameNumbers('p1-1', { start: 0, end: 1 }),
            frameRate: 4
        });
        this.anims.create({
            key: 'bounce-p2-1',
            frames: this.anims.generateFrameNumbers('p2-1', { start: 0, end: 1 }),
            frameRate: 4
        });

        this.scene.switch('scene');
    }

    constructor() { super('preload'); }
}

export default new Phaser.Game({
    type: Phaser.AUTO,
    scene: [P, Scene],
    scale: {
        width: 320,
        height: 180,
        zoom: Phaser.Scale.ZOOM_4X
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
});