import TwoPlayer from "./scenes/TwoPlayer.js";

class P extends Phaser.Scene {
    preload() {
        this.load.image('bg', 'assets/images/bg.png');
        this.load.image('c', 'assets/images/c.png');

        // Family preloads
        for (let i = 0; i < 4; i++) {
            const familyConfig = { frameWidth: 32, frameHeight: 32 };
            const s = i.toString();

            this.load.spritesheet(`p1-${s}`, `assets/images/p1-${s}.png`, familyConfig);
            this.load.spritesheet(`p2-${s}`, `assets/images/p2-${s}.png`, familyConfig);
        }

        // Pet graphics preloads
        const petConfig = { frameWidth: 16, frameHeight: 16 };
        this.load.spritesheet('cat', 'assets/images/cat.png', petConfig);
        this.load.spritesheet('dog', 'assets/images/dog.png', petConfig);

        // Snow preloads
        this.load.spritesheet('wall', 'assets/images/wall.png', { frameWidth: 16, frameHeight: 32 });
        this.load.spritesheet('snowpile', 'assets/images/snowpile.png', { frameWidth: 32, frameHeight: 96 });
        this.load.image('arrow', 'assets/images/arrow.png');

        // UI preloads
        this.load.spritesheet('p1-btn', 'assets/images/p1-btn.png', { frameWidth: 48, frameHeight: 16 });
        this.load.spritesheet('p2-btn', 'assets/images/p2-btn.png', { frameWidth: 48, frameHeight: 16 });

        // Audio and Music preloads
        this.load.audio('battle theme', ['assets/music/battletheme.mp3']);
        this.load.audio('battle lost', ['assets/music/battlelost.mp3']);

        this.load.audio('confirm', ['assets/sounds/confirm.mp3']);
        this.load.audio('cancel', ['assets/sounds/cancel.mp3']);
        this.load.audio('hoverbtn', ['assets/sounds/hoverbtn.mp3']);
        this.load.audio('snowballhit', ['assets/sounds/snowballhit.mp3']);
    }

    create() {
        // Family animations
        for (let i = 0; i < 4; i++) {
            const bounceConfig = { start: 0, end: 2 };
            const s = i.toString();

            this.anims.create({
                key: 'bounce-p1-' + s,
                frames: this.anims.generateFrameNumbers(`p1-${s}`, bounceConfig),
                frameRate: 4
            });
            this.anims.create({
                key: 'bounce-p2-' + s,
                frames: this.anims.generateFrameNumbers(`p2-${s}`, bounceConfig),
                frameRate: 4
            });
        }

        // Pet animations
        this.anims.create({
            key: 'idle-cat',
            frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 2 }),
            frameRate: 4
        });
        this.anims.create({
            key: 'build-cat',
            frames: this.anims.generateFrameNumbers('cat', { start: 3, end: 5 }),
            frameRate: 4
        });
        this.anims.create({
            key: 'idle-dog',
            frames: this.anims.generateFrameNumbers('dog', { start: 0, end: 2 }),
            frameRate: 4
        });
        this.anims.create({
            key: 'build-dog',
            frames: this.anims.generateFrameNumbers('dog', { start: 3, end: 5 }),
            frameRate: 4
        });

        this.scene.switch('two player');
    }

    constructor() { super('preload'); }
}

export default new Phaser.Game({
    type: Phaser.AUTO,
    scene: [P, TwoPlayer],
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