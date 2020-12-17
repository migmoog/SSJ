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
    /**@type {number} assigned in TBGbtns by ranges */
    snowballAmount;

    /**@type {Wall[]} */
    walls = [];
    /**@type {FamilyMember[]} */
    mems = [];

    /**@type {number} */
    deadMems = 0;
    /**@type {string} */
    texture;

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
        this.texture = texture;
        this.btns = new TBGbtns(scene, this, `${texture}btn`);

        for (let i = 0; i < 4; i++) {
            this.mems.push(new FamilyMember(scene, x, y + (i * 35), texture + i.toString(), this, i));
            this.walls.push(new Wall(scene, x <= 70 ? x + 30 : x - 30, y + (i * 35), this, i));

            this.addMultiple([
                this.mems[i],
                this.walls[i]
            ], true);
        }

        this.addMultiple([
            new Pet(scene, petX, 95, petTexture),
            new SnowAmount(scene, x <= 70 ? x - 50 : x + 50, 60)
        ], true);
    }

    throwAction() {
        if (this.snowballAmount !== 3)            
            this.children.entries[9].amount -= this.snowballAmount;

        this.opponent.children.iterate((e, ix) => {
            if (ix % 2 === 0 && (e.texture.key !== 'cat' && e.texture.key !== 'dog'))
                e.setInteractive()
                    .on('pointerover', function () { this.setTint(this.texture === 'p1-' ? 0xda2424 : 0x5ee9e9); }, e)
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
        this.setBodySize(2);

        this.on('pointerover', () => { 
            this.setTint(fam.texture === 'p1-' ? 0x5ee9e9 : 0xda2424); 
        })
            .on('pointerout', () => { this.clearTint(); })
            .on('pointerdown', () => {
                const pet = fam.children.entries[8];
                const pile = fam.children.entries[9];
                this.scene.sound.play('confirm');

                // Wall
                this.wallHeight++;
                // Pile
                pile.amount--;

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
    /**@type {boolean} */
    alive = true;
    /**@type {Family} */
    family;
    /**@type {Phaser.GameObjects.Image} */
    hrt;
    /**@type {number} */
    ix;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {string} texture 
     * @param {Family} fam
     */
    constructor(scene, x, y, texture, fam, ix) {
        super(scene, x, y, texture);
        scene.physics.add.existing(this);

        this.family = fam;
        this.ix = ix;
        this.hrt = scene.add.image(x <= scene.scale.width / 2 ? x + 15 : x - 15, y, `${texture.substr(0, 2)}-hrt`).setVisible(false);

        this.setBodySize(13);
        this.on('pointerdown', () => {
            // it's the opponent because you're clicking the target
            fam.opponent.add(new Snowball(
                scene,
                fam.opponent.mems[ix].x,
                fam.opponent.mems[ix].y,
                fam.walls[ix].wallHeight === 0 ? this : fam.walls[ix],
                fam.opponent
            ), true);
        });
    }

    preUpdate(t, dt) {
        this.play(`bounce-${this.texture.key}`, true);

        this.hrt.setFrame(this.health);
        if (this.body.touching.left || this.body.touching.right) {
            this.hrt.setVisible(true);
            this.scene.time.delayedCall(1500, () => {
                this.hrt.setVisible(false);
            });
        }

        if (this.health <= 0 && this.alive) {
            this.scene.tweens.addCounter({
                from: 1,
                to: 0,
                onUpdate: (twn) => { this.setAlpha(twn.getValue()); },
                onComplete: (twn) => {
                    this.family.killAndHide(this);
                    this.family.deadMems++;
                }
            });

            this.alive = false;
            this.family.killAndHide(this.family.walls[this.ix]);
        }

        super.preUpdate(t, dt);
    }
}

class Snowball extends Phaser.Physics.Arcade.Image {
    /**@type {FamilyMember | Wall} */
    target;
    /**@type {number} */
    amount;

    /**
     * @param {TwoPlayer} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {FamilyMember | Wall} target
     * @param {Family} fam 
     */
    constructor(scene, x, y, target, fam) {
        super(scene, x, y, 'snowball');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(4, 4, true);
        this.setVelocityX(x < scene.scale.width / 2 ? 150 : -150);
        this.target = target;
        this.amount = fam.snowballAmount;
    }

    preUpdate() {
        const targetTouch = this.target.body.touching;
        const touching = this.body.touching;

        if ((touching.right || touching.left) && (targetTouch.left || targetTouch.right)) {
            if (this.target.texture.key === 'wall') {
                this.target.wallHeight -= this.amount;
                this.destroy(true);
            } else {
                this.scene.sound.play('snowballhit');
                this.target.health -= this.amount;
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

class SnowAmount extends Phaser.GameObjects.BitmapText {
    amount = 4;

    /**
     * @param {Phaser.Scene} scn 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(scn, x, y) {
        super(scn, x, y, 'snowamount');
        this.setText(this.amount.toString()).setTint(0x180d2f);
    }

    preUpdate() {
        this.setText(this.amount.toString());
    }
}