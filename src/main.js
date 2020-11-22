import Scene from "./scenes/Scene.js";

class P extends Phaser.Scene {
    preload() {
        this.load.image('bg', 'assets/images/bg.png');

        for (let i = 0; i < 4; i++) {
            const familyConfig = { frameWidth: 32, frameHeight: 32 };
            const ixs = i.toString();

            this.load.spritesheet('p1-' + ixs, 'assets/images/p1-' + ixs + '.png', familyConfig);
            this.load.spritesheet('p2-' + ixs, 'assets/images/p2-' + ixs + '.png', familyConfig);
        }

        const petConfig = { frameWidth: 16, frameHeight: 16 };
        this.load.spritesheet('cat', 'assets/images/cat.png', petConfig);
        this.load.spritesheet('dog', 'assets/images/dog.png', petConfig);
        this.load.spritesheet('snowpile', 'assets/images/snowpile.png', { frameWidth: 16, frameHeight: 32 });

        //UI preloads
        this.load.spritesheet('p1-btn', 'assets/images/p1-btn.png', { frameWidth: 48, frameHeight: 16 });
    }

    create() {
        for (let i = 0; i < 4; i++) {
            const bounceConfig = { start: 0, end: 2 };
            const ixs = i.toString();

            this.anims.create({
                key: 'bounce-p1-' + ixs,
                frames: this.anims.generateFrameNumbers('p1-' + ixs, bounceConfig),
                frameRate: 4
            });
            this.anims.create({
                key: 'bounce-p2-' + ixs,
                frames: this.anims.generateFrameNumbers('p2-' + ixs, bounceConfig),
                frameRate: 4
            });
        }

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