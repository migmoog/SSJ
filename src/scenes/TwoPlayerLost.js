export default class TwoPlayerLost extends Phaser.Scene {
    create() {
        this.add.image(0, 0, 'end').setOrigin(0, 0);
    }

    update() {

    }
    
    constructor() { super('two player lost'); }
}