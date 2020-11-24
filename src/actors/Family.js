export class Family extends Phaser.GameObjects.Group {
    /**@type {boolean} */
    isTurn;
    /**@type {TBGbtns} */
    btns;
    /**@type {string} */
    action;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y
     * @param {string} texture
     * @param {string} petTexture
     * @param {number} petX
     * @param {boolean} isTurn 
     * @param {TBGbtns} btns
     */
    constructor(scene, x, y, texture, petTexture, petX, isTurn) {
        super(scene);

        this.isTurn = isTurn;

        for (let i = 0; i < 4; i++)
            this.addMultiple([
                new FamilyMember(scene, x, y + (i * 35), texture + i.toString()),
                new Wall(scene, x <= 70 ? x + 30 : x - 30, y + (i * 35))
            ], true);

        this.add(new Pet(scene, petX, 95, petTexture), true);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }

    throwAction() {
        //DEBUG
        console.log('called throw method');
        this.action = undefined;
    }

    buildAction() {
        this.children.entries[8].animToPlay = `build-${this.children.entries[8].texture.key}`
        this.scene.time.delayedCall(1500, () => {
            this.children.entries[8].setAnimToPlay( `idle-${this.children.entries[8].texture.key}`);
        });
        
        //DEBUG
        console.log('called build method');
        this.action = undefined;
    }

    gatherAction() {
        //DEBUG
        console.log('called gather method');
        this.action = undefined;
    }
}

export class AIfamily extends Family {
    /**@type {boolean} */
    isTurn;
    /**@type {TBGbtns} */
    btns;
    /**@type {string} */
    action;

    constructor(scene, x, y, texture, petTexture, petX, isTurn) {
        super(scene, x, y, texture, petTexture, petX, isTurn);

        this.isTurn = isTurn
    }

    preUpdate(t, dt) {

    }
}

class FamilyMember extends Phaser.GameObjects.Sprite {
    /**@type {number} */
    health = 6;

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }

    preUpdate(t, dt) {
        this.play('bounce-' + this.texture.key, true);

        super.preUpdate(t, dt);
    }
}

class Pet extends Phaser.GameObjects.Sprite {
    animToPlay = `idle-${this.texture.key}`;
    
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
        this.play(this.animToPlay, true);

        super.preUpdate(t, dt);
    }

    setAnimToPlay(anim) {
        this.animToPlay = anim;
    }
}

class Wall extends Phaser.Physics.Arcade.Image {
    /**@type {number} */
    height = 0;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(scene, x, y) {
        super(scene, x, y, 'wall', 0);
    }

    preUpdate() {
    }
}

class SnowPile extends Phaser.GameObjects.Image {
    /**
     * @param {Phaser.Scene} scn 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(scn, x, y) {
        super(scn, x, y, 'snowpile');
    }
}