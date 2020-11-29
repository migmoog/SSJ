import { Family } from "../actors/Family.js";

export default class TwoPlayer extends Phaser.Scene {
    /**@type {Phaser.Sound.BaseSound} */
    music;

    /**@type {Phaser.GameObjects.Sprite} */
    snowPile;
    /**@type {Family} */
    player1;
    /**@type {Family} */
    player2;

    create() {
        this.sound.add('battle theme', { loop: true, volume: 0.5 }).play();

        this.add.image(0, 0, 'bg').setOrigin(0, 0);

        this.player1 = new Family(this, 70, 40, 'p1-', 'cat', 120, true);
        this.player2 = new Family(this, 250, 40, 'p2-', 'dog', 200, false);

        this.player1.opponent = this.player2;
        this.player2.opponent = this.player1;

        this.physics.add.overlap(this.player1, this.player2, () => {

        });
    }

    update(d, dt) {
        if (this.player1.isTurn) {
            this.player1.btns.makeButtons();
        } else if (this.player2.isTurn) {
            this.player2.btns.makeButtons();
        }
    }

    changeTurn() {
        if (!this.player1.isTurn)
            this.player2.isTurn = true;
        else
            this.player1.isTurn = true;
    }

    constructor() { super('two player'); }
}