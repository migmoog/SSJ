export default class Family extends Phaser.GameObjects.Group {
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(scene, x, y, texture) {
        super(scene);

        for (let i = 0; i < 4; i++)
            this.add(new FamilyMember(scene, x, y + (i * 35), texture), true);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
}

class FamilyMember extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }

    preUpdate(t, dt) {
        this.play('bounce-' + this.texture.key, true);
        
        super.preUpdate(t, dt);
    }
}

class Pet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
}