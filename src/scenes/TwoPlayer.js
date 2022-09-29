import { Family } from "../actors/Family.js";

// TODO some much needed UI
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
        this.sound.play('battle theme', { loop: true, volume: 0.5 });

        this.add.image(0, 0, 'bg').setOrigin(0, 0);

        const whichTurn = !Phaser.Math.Between(0, 1);

        this.player1 = new Family(this, 70, 40, 'p1-', 'cat', 120, whichTurn);
        this.player2 = new Family(this, 250, 40, 'p2-', 'dog', 200, !whichTurn);

        this.player1.opponent = this.player2;
        this.player2.opponent = this.player1;

        this.physics.add.overlap(this.player1, this.player2);
        this.physics.add.overlap(this.player2, this.player1);
    }

    update() {
        if (this.player1.isTurn)
            this.player1.btns.makeButtons();
        else if (this.player2.isTurn)
            this.player2.btns.makeButtons();

        if (this.player1.deadMems === 4 || this.player2.deadMems === 4) {
            this.player1.btns.children.iterate((e) => { this.player1.btns.killAndHide(e); })
            this.player2.btns.children.iterate((e) => { this.player2.btns.killAndHide(e); })

            this.scene.switch('two player lost');
        }
    }

    constructor() { super('two player'); }
}