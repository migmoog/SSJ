// TODO add Throw Build Gather Commands
export default class TBGbtns extends Phaser.GameObjects.Group {
    /**
     * @param {Phaser.Scene} scn 
     */
    constructor(scn) {
        super(scn, [
            new Btn(scn, scn.scale.width / 2, 196, 'p1-btn', 0),
            new Btn(scn, scn.scale.width / 2, 196, 'p1-btn', 2),
            new Btn(scn, scn.scale.width / 2, 196, 'p1-btn', 4)
        ], { maxSize: 3 });

        scn.add.tween({
            ease: Phaser.Math.Easing.Quadratic.InOut,
            targets: this.children.entries[0],
            y: 40,
        });
        scn.add.tween({
            ease: Phaser.Math.Easing.Quadratic.InOut,
            targets: this.children.entries[1],
            y: 90
        });
        scn.add.tween({
            ease: Phaser.Math.Easing.Quadratic.InOut,
            targets: this.children.entries[2],
            y: 140
        });
    }

    preUpdate(t, dt) {
        const p = this.scene.input.activePointer;

        super.preUpdate(t, dt);
    }
}

class Btn extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} scn 
     * @param {number} x 
     * @param {number} y 
     * @param {string} texture 
     * @param {number} frame 
     */
    constructor(scn, x, y, texture, frame) {
        super(scn, x, y, texture, frame);

        this.setInteractive();
        this.on('pointerover', () => {
            this.setFrame(this.returnHighlight(frame));
        });
        this.on('pointerout', () => {
            this.setFrame(frame);
        });

        scn.add.existing(this);
    }

    returnHighlight(frm) {
        if (frm === 0)
            return 1
        else if (frm === 2)
            return 3
        else if (frm === 4)
            return 5
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
}