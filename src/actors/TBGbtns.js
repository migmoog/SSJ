import { Family } from "./Family.js";

export default class TBGbtns extends Phaser.GameObjects.Group {
    /**@type {string} */
    action;
    /**@type {string} */
    buttonKey
    /**@type {Family} */
    family;

    /**
     * @param {Phaser.Scene} scn
     * @param {Family} fam the family object it should assign actions to
     * @param {string} whichFam 1st or 2nd family, will assign the corresponding keys
     */
    constructor(scn, fam, whichFam) {
        super(scn);
        this.family = fam;

        this.buttonKey = whichFam;
    }

    makeButtons() {
        if (this.family.children.entries[9].amount !== 0) {
            this.addMultiple([
                new Btn(this.scene, this, this.family, this.scene.scale.width / 2, 196, this.buttonKey, 0),
                new Btn(this.scene, this, this.family, this.scene.scale.width / 2, 196, this.buttonKey, 2),
                new Btn(this.scene, this, this.family, this.scene.scale.width / 2, 196, this.buttonKey, 4)
            ], true);
            for (let i = 0; i < 3; i++)
                this.scene.tweens.add({
                    ease: Phaser.Math.Easing.Quadratic.InOut,
                    targets: this.children.entries[i],
                    y: 40 + (i * 50)
                });
        }
        else {
            this.add(
                new Btn(this.scene, this, this.family, this.scene.scale.width / 2, 196, this.buttonKey, 4)
                , true);

            this.scene.tweens.add({
                ease: Phaser.Math.Easing.Quadratic.InOut,
                targets: this.children.entries,
                y: this.scene.scale.height / 2
            });
        }
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
}

class Btn extends Phaser.GameObjects.Image {
    /**@type {TBGbtns} */
    group;
    /**@type {Family} */
    family;
    /**@type {string} */
    action;
    /**@type {Phaser.Sound.BaseSound} */
    sound;

    /**
     * @param {Phaser.Scene} scn
     * @param {TBGbtns} grp
     * @param {Family} fam
     * @param {number} x 
     * @param {number} y 
     * @param {string} texture 
     * @param {number} frame 
     */
    constructor(scn, grp, fam, x, y, texture, frame) {
        super(scn, x, y, texture, frame);

        switch (frame) {
            case 0:
                this.action = 'throw';
                break;
            case 2:
                this.action = 'build';
                break;
            case 4:
                this.action = 'gather';
        }

        // this.group = grp;
        this.family = fam;
        this.sound = scn.sound.add('hoverbtn', { volume: 0.5 });

        this.setInteractive()
            .on('pointerover', () => {
                this.setFrame(this.returnHighlight(frame));
                this.sound.play();
            })
            .on('pointerout', () => { this.setFrame(frame); })
            .on('pointerdown', () => {
                scn.sound.play('confirm');

                grp.children.iterate((e, ix) => {
                    e.disableInteractive();
                    // tweens ALL buttons out of the scene
                    scn.add.tween({
                        duration: 500,
                        ease: Phaser.Math.Easing.Quadratic.InOut,
                        targets: e,
                        y: 196,
                        onComplete: (twn, tgt) => {
                            tgt[0].destroy();
                        }
                    });
                });

                fam.action = this.action;

                if (!fam.isTurn) {
                    switch (this.action) {
                        case 'throw':
                            if (fam.children.entries[9].amount !== 0)
                                fam.throwAction();
                            break;
                        case 'build':
                            if (fam.children.entries[9].amount !== 0)
                                fam.buildAction();
                            break;
                        case 'gather':
                            fam.gatherAction();
                            break;
                    }
                }
            });

        scn.add.existing(this);
    }

    /**@param {number} frm */
    returnHighlight(frm) {
        switch (frm) {
            case 0:
                return 1;
            case 2:
                return 3;
            case 4:
                return 5;
        }
    }

    preUpdate() { }
}