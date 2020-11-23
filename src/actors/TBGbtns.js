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
        this.addMultiple([
            new Btn(this.scene, this, this.family, this.scene.scale.width / 2, 196, this.buttonKey, 0),
            new Btn(this.scene, this, this.family, this.scene.scale.width / 2, 196, this.buttonKey, 2),
            new Btn(this.scene, this, this.family, this.scene.scale.width / 2, 196, this.buttonKey, 4)
        ], true);

        for (let i = 0; i < 3; i++)
            this.scene.add.tween({
                ease: Phaser.Math.Easing.Quadratic.InOut,
                targets: this.children.entries[i],
                y: 40 + (i * 50)
            });
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
    /**@type {boolean} */
    returnAction = false;
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

        if (frame === 0)
            this.action = 'throw';
        else if (frame === 2)
            this.action = 'build';
        else if (frame === 4)
            this.action = 'gather';

        this.group = grp;
        this.family = fam;
        this.sound = scn.sound.add('hoverbtn');

        this.setInteractive()
            .on('pointerover', () => {
                this.setFrame(this.returnHighlight(frame));
                this.sound.play();
            })
            .on('pointerout', () => {
                this.setFrame(frame);
            })
            .on('pointerdown', () => {
                scn.sound.play('confirm');
                this.group.children.iterate((e, ix) => {
                    e.sound.destroy();
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

                this.group.action = this.action;
                this.family.action = this.action;

                //DEBUG
                console.log("Group action: " + this.group.action);
                console.log("Family action: " + this.family.action);
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

    preUpdate() {
    }
}