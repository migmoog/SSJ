import Family from "../actors/Family.js";
import TBGbtns from "../actors/TBGbtns.js";

export default class Scene extends Phaser.Scene {
    /**@type {Phaser.Sound.BaseSound} */
    music;

    /**@type {Phaser.GameObjects.Sprite} */
    snowPile;
    /**@type {Family} */
    player1;
    /**@type {Family} */
    player2;

    /**@type {TBGbtns} */
    p1Btns;
    /**@type {TBGbtns} */
    p2Btns;

    create() {
        this.music = this.sound.add('battle theme', { loop: true, volume: 0.5 }).play();

        this.add.image(0, 0, 'bg').setOrigin(0, 0);
        
        this.player1 = new Family(this, 70, 40, 'p1-', 'cat', 120, true);
        this.p1Btns = new TBGbtns(this, this.player1);
        
        this.player2 = new Family(this, 250, 40, 'p2-', 'dog', 200, false);
        this.p2Btns = new TBGbtns(this, this.player2);

        if (this.player1.isTurn) {
            this.p1Btns.makeButtons();
            this.player1.isTurn = false;
        }
    }

    update(d, dt) {

    }

    constructor() { super('scene'); }
}