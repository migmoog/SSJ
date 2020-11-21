import Scene from "./scenes/Scene.js";

class P extends Phaser.Scene {
    preload() {
        /**@type {Phaser.Types.Loader.FileTypes.ImageFrameConfig} */
        const familyConfig = { frameWidth: 32, frameHeight: 32 };
        /**@type {Phaser.Types.Loader.FileTypes.ImageFrameConfig} */
        const petConfig = { frameWidth: 16, frameHeight: 16 };

        this.load.image('bg', 'assets/images/bg.png');

        // TODO finish family anims
        for (let i = 0; i < 4; i++) {
            let ixs = i.toString();
            
            this.load.spritesheet('p1-' + ixs, 'assets/images/p1-' + ixs + '.png', familyConfig);
            this.load.spritesheet('p2-' + ixs, 'assets/images/p2-' + ixs + '.png', familyConfig);
        }

        this.load.spritesheet('cat', 'assets/images/cat.png', petConfig);
        this.load.spritesheet('dog', 'assets/images/dog.png', petConfig);
        this.load.spritesheet('snowpile', 'assets/images/snowpile.png', { frameWidth: 16, frameHeight: 32 });
    }

    create() {
        const bounceConfig = { start: 0, end: 2 };
        this.anims.create({
            key: 'bounce-p1-0',
            frames: this.anims.generateFrameNumbers('p1-0', bounceConfig),
            frameRate: 4
        });
        this.anims.create({
            key: 'bounce-p1-1',
            frames: this.anims.generateFrameNumbers('p1-1', bounceConfig),
            frameRate: 4
        });
        this.anims.create({
            key: 'bounce-p1-2',
            frames: this.anims.generateFrameNumbers('p1-2', bounceConfig),
            frameRate: 4
        });
        this.anims.create({
            key: 'bounce-p1-3',
            frames: this.anims.generateFrameNumbers('p1-3', bounceConfig),
            frameRate: 4
        });

        this.anims.create({
            key: 'bounce-p2-0',
            frames: this.anims.generateFrameNumbers('p2-0', bounceConfig),
            frameRate: 4
        });
        this.anims.create({
            key: 'bounce-p2-1',
            frames: this.anims.generateFrameNumbers('p2-1', bounceConfig),
            frameRate: 4
        });
        this.anims.create({
            key: 'bounce-p2-2',
            frames: this.anims.generateFrameNumbers('p2-2', bounceConfig),
            frameRate: 4
        });
        this.anims.create({
            key: 'bounce-p2-3',
            frames: this.anims.generateFrameNumbers('p2-3', bounceConfig),
            frameRate: 4
        });

        // TODO finish pet anims
        this.anims.create({
            key: 'idle-cat',
            frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 1 }),
            frameRate: 4
        });
        this.anims.create({
            key: 'idle-dog',
            frames: this.anims.generateFrameNumbers('dog', { start: 0, end: 1 }),
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