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

        this.player1 = new Family(this, 60, 40, 'p1-1');
        this.player2 = new Family(this, 320 - 70, 40, 'p2-1');
    }

    update() {

    }

    constructor() { super('scene'); }
}