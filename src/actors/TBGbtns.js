// TODO add Throw, Build, and Gather Commands
export default class TBGbtns extends Phaser.GameObjects.Group {
    /**@type {string} */
    action;
    /**@type {Family} */
    family;

    /**
     * @param {Phaser.Scene} scn
     * @param {Family} fam
     */
    constructor(scn, fam) {
        super(scn);
        this.family = fam;
    }

    makeButtons() {
        this.addMultiple([
            new Btn(this.scene, this, this.family, this.scene.scale.width / 2, 196, 'p1-btn', 0),
            new Btn(this.scene, this, this.family, this.scene.scale.width / 2, 196, 'p1-btn', 2),
            new Btn(this.scene, this, this.family, this.scene.scale.width / 2, 196, 'p1-btn', 4)
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

        this.setInteractive()
            .on('pointerover', () => {
                this.setFrame(this.returnHighlight(frame));
                scn.sound.play('hoverbtn');
            })
            .on('pointerout', () => {
                this.setFrame(frame);
            })
            .on('pointerdown', () => {
                scn.sound.play('confirm');
                this.group.children.iterate((e, ix) => {
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