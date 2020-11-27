export class Family extends Phaser.GameObjects.Group {
    /**@type {boolean} */
    isTurn;
    /**@type {TBGbtns} */
    btns;
    /**@type {string} */
    action;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y
     * @param {string} texture
     * @param {string} petTexture
     * @param {number} petX
     * @param {boolean} isTurn 
     * @param {TBGbtns} btns
     */
    constructor(scene, x, y, texture, petTexture, petX, isTurn) {
        super(scene);

        this.isTurn = isTurn;

        for (let i = 0; i < 4; i++)
            this.addMultiple([
                new FamilyMember(scene, x, y + (i * 35), texture + i.toString()),
                new Wall(scene, x <= 70 ? x + 30 : x - 30, y + (i * 35), this)
            ], true);

        this.addMultiple([
            new Pet(scene, petX, 95, petTexture),
            new SnowPile(scene, x <= 70 ? x - 30 : x + 30, 95).setFlipX(x > 70)
        ], true);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }

    throwAction() {
        //DEBUG
        console.log('called throw method');
    }

    buildAction() {
        const pet = this.children.entries[8];

        this.children.iterate((e, ix) => {
            if (ix % 2 !== 0)
                e.setInteractive()
        });

        //DEBUG
        console.log('called build method');
    }

    gatherAction() {
        //DEBUG
        console.log('called gather method');
    }
}

export class AIfamily extends Family {
    /**@type {boolean} */
    isTurn;
    /**@type {TBGbtns} */
    btns;
    /**@type {string} */
    action;

    constructor(scene, x, y, texture, petTexture, petX, isTurn) {
        super(scene, x, y, texture, petTexture, petX, isTurn);

        this.isTurn = isTurn
    }

    preUpdate(t, dt) {

    }
}

class FamilyMember extends Phaser.GameObjects.Sprite {
    /**@type {number} */
    health = 6;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {number} texture 
     */
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }

    preUpdate(t, dt) {
        this.play(`bounce-${this.texture.key}`, true);

        super.preUpdate(t, dt);
    }
}

class Pet extends Phaser.GameObjects.Sprite {
    animToPlay = `idle-${this.texture.key}`;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {string} texture 
     */
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }

    preUpdate(t, dt) {
        this.play(this.animToPlay, true);

        super.preUpdate(t, dt);
    }

    setAnimToPlay(anim) {
        this.animToPlay = anim;
    }
}

class Wall extends Phaser.Physics.Arcade.Image {
    /*
        IMPORTANT: it's called wall height now because we 
        were accidentally overriding super's variable
    */
    /**@type {number} */
    wallHeight = 0;
    /**@type {Family} */
    family;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {Family} fam
     */
    constructor(scene, x, y, fam) {
        super(scene, x, y, 'wall', 0);

        this.family = fam;

        this.on('pointerover', function () { this.setTint(0x5ee9e9); })
            .on('pointerout', function () { this.clearTint(); })
            .on('pointerdown', function () {
                const pet = fam.children.entries[8];
                this.scene.sound.play('confirm');

                this.wallHeight++;
                console.log(this.wallHeight);

                fam.children.iterate((e, ix) => {
                    if (!(ix % 2 === 0))
                        e.disableInteractive();
                });

                pet.setAnimToPlay(`build-${pet.texture.key}`);
                this.scene.time.delayedCall(1500, () => {
                    pet.setAnimToPlay(`idle-${pet.texture.key}`);
                    fam.isTurn = true;
                });

                console.log("PILE WAS CLICKED")
            });
    }

    preUpdate() {
        this.setFrame(this.wallHeight);

        if (this.wallHeight > 4)
            this.wallHeight = 4;
        else if (this.wallHeight < 0)
            this.wallHeight = 0;
    }
}

class SnowPile extends Phaser.GameObjects.Image {
    amount = 20;

    /**
     * @param {Phaser.Scene} scn 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(scn, x, y) {
        super(scn, x, y, 'snowpile');
    }

    preUpdate() {
        this.setFrame(this.amount / 4);
    }
}