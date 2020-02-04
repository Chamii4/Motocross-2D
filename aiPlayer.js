/**
 * @class AiPlayer
 * This class object defines how the ai controlled bikes in the game will act.
 * This class takes no parameters.
 * This class has no return value.
*/
function AiPlayer(startPositionX, w) {

    this.x = startPositionX;
    this.w = w || 0.1;
    this.y = 0; 
    this.ySpeed = 0;
    this.gameover = false;
    this.rot = 0;
    this.rot360 = 0;
    this.timer = 0;
    this.points = 0;
    this.name = "AI-player";
    this.crashcounter = 0;
    this.rotationSpeed = 0;
    this.n = 0;
    this.img = new Image();
    this.img.src = "./player.png";
    this.grounded = undefined;

     /**
    * AiPlayer.update() function is used to update its coordinates depending on its variable values.
    * This function takes no parameters.
    * This function has no return value.
    */
    this.update = function () {

        let p1 = canvas.height - game.terrainEngine.noise(game.trackPosition + this.x) * 0.25; //rear point
        let p2 = canvas.height - game.terrainEngine.noise(game.trackPosition + 5 + this.x) * 0.25; //front point

        // Update the aiPlayers relative the player. 
        if (game.speed <= game.aiSpeed) {
            this.x += game.aiSpeed * 0.2; //+=
        }
        if (game.speed > game.aiSpeed) {
            this.x += (game.speed * 0.01); //-=
        }


        this.grounded = 0;

        if (p1 - 12 > this.y) { 
            this.ySpeed += 0.1;

            if ((p1 - 12 - this.y >= 50) && (game.trackPosition > canvas.width / 2)) {
                this.rotationSpeed += (1) * 0.03; 
                this.rot -= this.rotationSpeed * 0.1; 
            }
            if ((p1 - 12 - this.y < 50) && (Math.abs(this.rot) > Math.PI * 0.5) && (game.trackPosition > canvas.width / 2)) {
                this.rotationSpeed += (-1) * 0.03;
                this.rot -= this.rotationSpeed * 0.1;
            }

        } else {
            this.ySpeed -= this.y - (p1 - 12);
            this.y = p1 - 12; 
            this.grounded = 1; 
            this.rot360 = 0;
            this.rotationSpeed = 0;
            if (this.grounded && Math.abs(this.rot) > Math.PI * 0.3) {
                if (this.points > 0) {
                    this.points -= 1;
                }
                this.crashcounter += 1;
                this.crash = true;
            }
        }

        //the angle (in radians) from a point and the positive x  axis, a value between PI and -PI randians.
        //Sets the up or down power
        let angle = Math.atan2((p2 - 12) - this.y, (this.x + 5) - this.x); 
        this.y += this.ySpeed;

        if (!this.grounded && (game.trackPosition > canvas.width / 2)) {
            this.rot360 = Math.abs(this.rot360 + angle);
            if (this.rot360 >= 100) {
                this.points += 1;
                this.rot360 = this.rot360 - 100;
            }
        }

        if (this.grounded && game.playing) {
            this.rot -= (this.rot - angle);
            this.rot360 = 0;
        }

        if (this.rot > Math.PI) // 1 Pi rad = 180 degrees.
            this.rot = -Math.PI;
        if (this.rot < -Math.PI)
            this.rot = Math.PI;
    }

    /**
    * AiPlayer.draw() function is used to draw the updated coordinates and positions onto the canvas.
    * This function takes no parameters.
    * This function has no return value.
    */
    this.draw = function () {

        let maxPosition = Math.max(game.trackPosition + (canvas.width / 2), game.trackPosition + this.x);
        let minPosition = Math.min(game.trackPosition + (canvas.width / 2), game.trackPosition + this.x);
        let distanceAiPlayerPlayer = maxPosition - minPosition;

        //Checks if the AiPlayer object is within the canvas and should be drawn.
        if (distanceAiPlayerPlayer < canvas.width / 2) {
            //Checks if the AiPlayer failed the landing.
            if (this.crash) {
                ctx.fillText("crash", this.x, this.y - 50);
                this.timer += 1;
                if (this.timer > 60) {
                    this.timer = 0;
                    this.crash = false;
                }
            }

            ctx.fillText("Points " + this.points, this.x, this.y - 30); 

            ctx.save();
            ctx.translate(this.x, this.y - 3)
            ctx.rotate(this.rot)
            ctx.drawImage(this.img, -15, -15, 30, 30)
            ctx.restore();
        }
    }
}
