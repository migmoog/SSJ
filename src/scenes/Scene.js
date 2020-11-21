import Family from "../actors/Family.js";

export default class Scene extends Phaser.Scene {
    keys;

    /**@type {Phaser.GameObjects.Sprite} */
    snowPile;
    /**@type {Family} */
    player1;
    /**@type {Family} */
    player2;

    create() {
        // CONTROLS
        this.keys = this.input.keyboard.addKeys('left,right,up,down,z');

        this.add.image(0, 0, 'bg').setOrigin(0, 0);

        this.player1 = new Family(this, 70, 40, 'p1-', 'cat', 70 + 50);
        this.player2 = new Family(this, 250, 40, 'p2-', 'dog', 200);
    }

    update() {

    }

    constructor() { super('scene'); }
}