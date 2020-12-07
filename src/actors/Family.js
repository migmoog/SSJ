import TwoPlayer from "../scenes/TwoPlayer.js";
import TBGbtns from "./TBGbtns.js";

export class Family extends Phaser.GameObjects.Group {
    /**@type {boolean} */
    isTurn;
    /**@type {string} */
    action;
    /**@type {TBGbtns} */
    btns;
    /**@type {Family} assigned in the scene after instancing */
    opponent;

    /**@type {Wall[]} */
    walls = [];
    /**@type {FamilyMember[]} */
    famMems = [];

    /**
     * @param {TwoPlayer} scene 
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

        for (let i = 0; i < 4; i++) {
            this.famMems.push(new FamilyMember(scene, x, y + (i * 35), texture + i.toString(), this, i));
            this.walls.push(new Wall(scene, x <= 70 ? x + 30 : x - 30, y + (i * 35), this));

            this.addMultiple([
                this.famMems[i],
                this.walls[i]
            ], true);
        }

        this.addMultiple([
            new Pet(scene, petX, 95, petTexture),
            new SnowPile(scene, x <= 70 ? x - 30 : x + 30, 95).setFlipX(x > 70)
        ], true);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }

    throwAction() {
        this.opponent.children.iterate((e, ix) => {
            if (ix % 2 === 0 && (e.texture.key !== 'cat' && e.texture.key !== 'dog'))
                e.setInteractive()
                    .on('pointerover', function () { this.setTint(0x5ee9e9); }, e)
                    .on('pointerout', function () { this.clearTint(); }, e)
                    .on('pointerdown', () => {
                        this.opponent.children.iterate((element, index) => {
                            if (index % 2 === 0)
                                element.disableInteractive();
                        });

                        this.scene.sound.play('snowballmake');
                        this.scene.time.delayedCall(1500, () => { this.opponent.isTurn = true; });
                    });
        });
    }

    buildAction() {
        // wall building is in wall
        this.children.iterate((e, ix) => {
            // Wall building is in each instance of Wall
            if (ix % 2 !== 0 && e.wallHeight < 4)
                e.setInteractive()
        });
    }

    gatherAction() {
        const pet = this.children.entries[8];
        this.scene.tweens.add({
            targets: pet,
            duration: 1000,
            yoyo: true,
            x: pet.x === 120 ? -16 : this.scene.scale.width + 16,
            onStart: (twn, tgt) => {
                tgt[0].setFlipX(true).setAnim(`build-${pet.texture.key}`);
            },
            onYoyo: (twn, tgt) => { tgt.setFlipX(false); },
            onComplete: (twn, tgt) => {
                tgt[0].setAnim(`idle-${pet.texture.key}`);

                this.children.entries[9].amount++;
                console.log(this.children.entries[9].amount);

                this.opponent.isTurn = true;
            }
        });
    }
}

class Wall extends Phaser.Physics.Arcade.Image {
    /**@type {number} */
    wallHeight = 0;
    /**@type {Family} */
    family;

    /**
     * @param {TwoPlayer} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {Family} fam
     */
    constructor(scene, x, y, fam) {
        super(scene, x, y, 'wall', 0);
        scene.physics.add.existing(this);

        this.family = fam;

        this.on('pointerover', () => { this.setTint(0x5ee9e9); })
            .on('pointerout', () => { this.clearTint(); })
            .on('pointerdown', () => {
                const pet = fam.children.entries[8];
                const pile = fam.children.entries[9];
                this.scene.sound.play('confirm');

                // Wall
                this.wallHeight++;
                console.log("Wall's height", this.wallHeight);
                // Pile
                pile.amount--;
                console.log('Pile Amount', pile.amount);

                // Changes the walls back to being unclickable
                fam.children.iterate((e, ix) => {
                    if (ix % 2 !== 0)
                        e.disableInteractive();
                });

                pet.setAnim(`build-${pet.texture.key}`);
                this.scene.time.delayedCall(1500, () => {
                    pet.setAnim(`idle-${pet.texture.key}`);
                    fam.opponent.isTurn = true;
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

class FamilyMember extends Phaser.Physics.Arcade.Sprite {
    /**@type {number} */
    health = 4;
    /**@type {Family} */
    family;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {number} texture 
     * @param {Family} fam
     */
    constructor(scene, x, y, texture, fam, ix) {
        super(scene, x, y, texture);
        scene.physics.add.existing(this);

        this.on('pointerdown', () => {
            // it's the opponent because you're clicking the target
            fam.opponent.add(new Snowball(
                scene,
                fam.opponent.famMems[ix].x,
                fam.opponent.famMems[ix].y,
                fam.walls[ix].wallHeight === 0 ? this : fam.walls[ix]
            ), true);
        });
    }

    preUpdate(t, dt) {
        this.play(`bounce-${this.texture.key}`, true);

        if (this.health === 0)
            this.scene.tweens.addCounter({
                from: 1,
                to: 0,
                onUpdate: (twn) => { this.setAlpha(twn.getValue()); },
                onComplete: (twn) => { this.family.killAndHide(this); }
            });

        super.preUpdate(t, dt);
    }
}

class Snowball extends Phaser.Physics.Arcade.Image {
    /**@type {FamilyMember | Wall} */
    target;

    /**
     * @param {TwoPlayer} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {Family} enemyFam 
     */
    constructor(scene, x, y, target) {
        super(scene, x, y, 'snowball');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(4, 4, true);
        this.setVelocityX(x < scene.scale.width / 2 ? 150 : -150);
        this.target = target;
    }

    preUpdate() {
        const targetTouch = this.target.body.touching;
        const touching = this.body.touching;

        if ((touching.right || touching.left) && (targetTouch.left || targetTouch.right)) {
            if (this.target.texture.key === 'wall') {
                this.target.wallHeight--;
                console.log(this.target.texture.key, this.target.wallHeight);
                this.destroy(true);
            } else {
                this.target.health--;
                console.log(this.target.texture.key, this.target.health);
                this.destroy(true);
            }
        }
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

    setAnim(anim) {
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
        if (amnt <= 15)
            return 3;
        else if (amnt <= 10)
            return 2;
        else if (amnt <= 5)
            return 1;
        else if (amnt === 0)
            return 0;
    }
}