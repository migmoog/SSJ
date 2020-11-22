export default class Family extends Phaser.GameObjects.Group {
    /**@type {boolean} */
    isTurn;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y
     * @param {string} texture
     * @param {string} petTexture
     * @param {number} petX 
     */
    constructor(scene, x, y, texture, petTexture, petX) {
        super(scene);

        for (let i = 0; i < 4; i++)
            this.addMultiple([
                new FamilyMember(scene, x, y + (i * 35), texture + i.toString()),
                new SnowPile(scene, x == 70 ? x + 30 : x - 30, y + (i * 35))
            ], true);

        this.add(new Pet(scene, petX, 95, petTexture), true);
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
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {string} texture 
     */
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }

    preUpdate(t, dt) {
        this.play('idle-' + this.texture.key, true);

        super.preUpdate(t, dt);
    }
}

class SnowPile extends Phaser.GameObjects.Sprite {
    /**@type {number} */
    height = 0;
    
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(scene, x, y) {
        super(scene, x, y, 'snowpile', 0);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
}