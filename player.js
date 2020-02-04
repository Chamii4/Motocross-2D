/**
 * @class Player
 * This class object is what the user controls in the game.
 * This class takes no parameters.
 * This class has no return value.
 */
function Player() {
    this.points = 0;
    this.x = canvas.width / 2;
    this.y = 0;
    this.name = "You";
    this.ySpeed = 0;
    this.rot360 = 0;
    this.rot = 0;
    this.rotationSpeed = 0;
    this.crashcounter = 0;
    this.crash = 0;
    this.img = new Image();
    this.img.src = "./motocross.png";
    this.spriteWidth = 30;
    this.spriteHeight = 30;

    /**
    * Player.update() function is used to update its coordinates depending on user input.
    * This function takes no parameters.
    * This function has no return value.
    */
    this.update = function () {
        let p1 = canvas.height - game.terrainEngine.noise(game.trackPosition + this.x) * 0.25;
        let p2 = canvas.height - game.terrainEngine.noise(game.trackPosition + 5 + this.x) * 0.25; 

        this.grounded = 0; 

        if (p1 - 12 > this.y) {       
            this.ySpeed += 0.1;

        } else {
            this.ySpeed -= this.y - (p1 - 12);
            this.y = p1 - 12;
            this.grounded = 1;
            this.rot360 = 0;
            this.rotationSpeed = 0;
            if (this.grounded && Math.abs(this.rot) > Math.PI * 0.3) {
                this.crashcounter += 1;
                this.crash = true;
            }
        }

        //the angle radians between two points.
        var angle = Math.atan2((p2 - 12) - this.y, (this.x + 5) - this.x);
        this.y += this.ySpeed;

        if (!this.grounded && (game.trackPosition > canvas.width / 2)) {
            this.rot360 = Math.abs(this.rot360 + angle);
            if (this.rot360 >= 100) {
                this.points += 1;
                this.rot360 = this.rot360 - 100;
            }
        }

        // Game over if upside down
        if (!game.playing || this.grounded && Math.abs(this.rot) > Math.PI * 0.5) {
            game.playing = false;
            game.restart();
        }

        // reset rotation
        if (this.grounded && game.playing) {

            this.rotationSpeed = 0;
            this.rot -= (this.rot - angle);
            this.rot360 = 0;

        }
        

        //rotation
        this.rotationSpeed += (keymap.ArrowLeft - keymap.ArrowRight) * 0.03; 
        this.rot -= this.rotationSpeed * 0.1; 

        if (this.rot > Math.PI) // 1 Pi rad = 180 degrees.
            this.rot = -Math.PI;
        if (this.rot < -Math.PI)
            this.rot = Math.PI;
    }

    /**
    * Player.draw() function is used to draw the updated coordinates and positions onto the canvas.
    * This function takes no parameters.
    * This function has no return value.
    */
    this.draw = function () {



        ctx.fillText("You " + this.points + " ", this.x, this.y - 30);

        ctx.save();
        ctx.translate(this.x, this.y - 3); // 3 pxl above groundlevel (looks nicer)
        ctx.rotate(this.rot);
        ctx.drawImage(this.img, -15, -15, this.spriteWidth, this.spriteHeight); 
        ctx.restore();
    }
}
