export default class TwoPlayerLost extends Phaser.Scene {
    create() {
        this.add.text(this.scale.width / 2, this.scale.height / 2, "Fuck we lost");
    }

    update() {

    }
    
    constructor() { super('two player lost'); }
}