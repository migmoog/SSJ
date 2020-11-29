import TBGbtns from "./TBGbtns.js";

// TODO finish Gather and Throw
export class Family extends Phaser.GameObjects.Group {
    /**@type {boolean} */
    isTurn;
    /**@type {string} */
    action;
    /**@type {TBGbtns} */
    btns

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y
     * @param {string} texture
     * @param {string} petTexture
     * @param {number} petX
     * @param {boolean} isTurn 
     */
    constructor(scene, x, y, texture, petTexture, petX, isTurn) {
        super(scene);

        this.isTurn = isTurn;
        this.btns = new TBGbtns(scene, this, `${texture}btn`);

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
        this.children.iterate((e, ix) => {
            if (ix % 2 !== 0 && e.wallHeight < 4)
                e.setInteractive()
        });

        //DEBUG
        console.log('called build method');
    }

    gatherAction() {
        const pet = this.children.entries[8];
        this.scene.tweens.add({
            targets: pet,
            duration: 1000,
            yoyo: true,
            x: pet.x >= 70 ? -16 : this.scene.scale.width + 16,
            onStart: (twn, tgt) => {
                tgt[0].setFlipX(true).setAnimToPlay(`build-${pet.texture.key}`);
            },
            onYoyo: (twn, tgt) => {
                tgt.setFlipX(false);
            },
            onComplete: (twn, tgt) => {
                tgt[0].setAnimToPlay(`idle-${pet.texture.key}`);

                this.children.entries[9].amount++;
                console.log(this.children.entries[9].amount);

                this.isTurn = true;
            }
        });

        //DEBUG
        console.log('called gather method');
    }
}

//TODO add choices of value increase for walls
class Wall extends Phaser.Physics.Arcade.Image {
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

        this.on('pointerover', () => { this.setTint(0x5ee9e9); })
            .on('pointerout', () => { this.clearTint(); })
            .on('pointerdown', () => {
                const pet = fam.children.entries[8];
                const pile = fam.children.entries[9];
                this.scene.sound.play('confirm');

                this.wallHeight++;
                console.log(this.wallHeight);
                pile.amount--;
                console.log(pile.amount);

                fam.children.iterate((e, ix) => {
                    if (ix % 2 !== 0)
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

class SnowPile extends Phaser.GameObjects.Image {
    amount = 15;

    /**
     * @param {Phaser.Scene} scn 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(scn, x, y) {
        super(scn, x, y, 'snowpile');
    }

    preUpdate() {
        this.setFrame(this.returnFrame(this.amount));
    }

    returnFrame(amnt) {
        if (amnt <= 15) {
            return 3;
        } else if (amnt <= 10) {
            return 2;
        } else if (amnt <= 5) {
            return 1;
        } else if (amnt === 0) {
            return 0;
        }
    }
}