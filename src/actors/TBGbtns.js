export default class TBGbtns extends Phaser.GameObjects.Group {
    /**
     * @param {Phaser.Scene} scn 
     */
    constructor(scn) {
        super(scn, [
            scn.add.sprite(scn.scale.width / 2, 196, 'p1-btn', 0),            
            scn.add.sprite(scn.scale.width / 2, 196, 'p1-btn', 1),            
            scn.add.sprite(scn.scale.width / 2, 196, 'p1-btn', 2)            
        ], { maxSize: 3 });

        scn.add.tween({
            ease: Phaser.Math.Easing.Quadratic.InOut,
            targets: this.children.entries[0],
            y: 40,
            onComplete: (twn, tgt) => {
                tgt[0].setFrame(3);
            }
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
        const k = this.scene.keys; 
        
        super.preUpdate(t, dt);
    }
}