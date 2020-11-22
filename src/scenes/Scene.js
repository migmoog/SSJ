import Family from "../actors/Family.js";
import TBGbtns from "../actors/TBGbtns.js";

export default class Scene extends Phaser.Scene {
    /**@type {Phaser.GameObjects.Sprite} */
    snowPile;
    /**@type {Family} */
    player1;
    /**@type {Family} */
    player2;

    /**@type {Phaser.GameObjects.Group} */
    p1Btns;
    /**@type {Phaser.GameObjects.Group} */
    p2Btns;

    create() {
        this.add.image(0, 0, 'bg').setOrigin(0, 0);

        this.player1 = new Family(this, 70, 40, 'p1-', 'cat', 120);
        this.player2 = new Family(this, 250, 40, 'p2-', 'dog', 200);

        this.time.delayedCall(500, () => {
            this.p1Btns = new TBGbtns(this);
        });
    }

    update(d, dt) {

    }

    constructor() { super('scene'); }
}