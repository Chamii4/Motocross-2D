canvas = document.createElement("canvas");
ctx = this.canvas.getContext("2d");
canvas.width = 1080;
canvas.height = 480;
document.body.appendChild(canvas);

var keymap = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };

onkeydown = d => keymap[d.key] = 1;
onkeyup = d => keymap[d.key] = 0;

// physics engine...

/**
 * @class Game 
 * The programs main object. Contains the main variables, update and -drawfunctions.
 * This class takes no parameters.
 * This class has no return value.
 */
function Game() {
    this.speed = 0;
    this.aiSpeed = 0;
    this.playing = true;
    this.breaking = false;
    this.frameNumber = 0;
    this.finishline = 20000;
    this.goalflag = new Goalflag();
    this.player = new Player();
    this.aiPlayers = [new AiPlayer(canvas.width * 0.25, 0.15), new AiPlayer(canvas.width * 0.75, 0.075)];
    this.trackPosition = 0;
    this.trackPositionAiPlayers = 0;
    this.winner = undefined; //new
    this.terrainEngine = new utils();
    this.terrainEngine.init();

    /**
   * If the player has reached the goal, display results.
   * This function takes no parameters.
   * This function has no return value.
   */
    this.goal = function () {
        // Calculate winners.
        if (!this.finish) {
            let topList = [this.player, ...this.aiPlayers];
            let resMap = topList.map(p => [{ name: p.name, points: p.points, crashcounter: p.crashcounter }]);
            let winners = resMap.sort(function (a, b) { return a.points - b.points });
            let win = winners[0];
            this.winner = win[0].name + " " + win[0].points + " points";
            this.finish = true;
        }

    }

    /**
    * @class Goalflag
    * Used for creating the goalflag image object. 
    * This class takes no parameters.
    * This object returns itself (return this).
    */
    function Goalflag() {
       
        this.x = canvas.width; //canvas.width
        this.y = canvas.height / 2;
        this.img = new Image();
        this.img.src = "./goal.png";

        /**
        * Goalflag.draw() is called in Game.draw() when the goalflags x-position is withtin the canvas.
        * This function takes no parameters.
        * This function has no return value.
        */
        this.draw = function () {
            this.x -= game.speed * 10;//new
            ctx.save();
            ctx.drawImage(this.img, this.x, 416, 32, 64); //416, 64, 128
            ctx.restore();
        }
        return this;
    }

    /**
    * Restart function is called when the player does not land correctly on the ground.
    * Restarts the game.
    * This function takes no parameter.
    * This function returns no value.
    */
    this.restart = function () {
        location.reload();
    }

    /**
    * Game.update() function updates the speed and position of all player and aiPlayer objects
    * This function takes no parameters.
    * This function has no return value.
    */
    this.update = function () {
        let factor1 = 1.3 * Math.random();
        if ((keymap.ArrowUp - keymap.ArrowDown) <= 0) {
            this.breaking = true;
        } else {
            this.breaking = false;
        }

        this.speed -= (this.speed - (keymap.ArrowUp - keymap.ArrowDown)) * 0.01;
        this.aiSpeed -= (this.aiSpeed - (factor1)) * 0.01;

        //calculate trackpositions
        this.trackPosition += 10 * this.speed;
        this.trackPositionAiPlayers += 10 * this.aiSpeed;

        //Update the player data...
        this.player.update();
        this.aiPlayers.forEach(p => p.update());
    }

    /**
    * Game.draw() function draws all objects onto the canvas. 
    * This function takes no parameters.
    * This function has no return value.
    */
    this.draw = function () {
        //Draw the sky
        ctx.fillStyle = "#19f";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the mountain range in the background
        ctx.fillStyle = "rgba(105,105,105,0.5)";
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let pos of this.terrainEngine.iterableMountains) {
            ctx.lineTo(...pos);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.fill();

        // Draw the treeline in the background.
        ctx.fillStyle = "rgba(0,255,0,0.5)";
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let pos of this.terrainEngine.iterableTrees) {
            ctx.lineTo(...pos);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.fill();

        // Draw the ground
        ctx.fillStyle = "#444";
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let pos of this.terrainEngine.iterableGround) {
            ctx.lineTo(...pos);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.fill();

        //Draw players
        this.player.draw();
        this.aiPlayers.forEach(p => p.draw());

        //Draw goalflag if it should be visible to the player.
        if (game.trackPosition > this.finishline - 550) { //finishline - 550
            this.goalflag.draw();
        }

        //update ui text
        ctx.font = "30px" + " " + "Consolas";
        ctx.fillStyle = "black";
        //left side
        ctx.fillText("Distance: " + Math.round(this.trackPosition / 100) + " / " + Math.round(game.finishline / 100), 10, 30);
        ctx.fillText("Speed: " + Math.round(game.speed * 100), 10, 60);
        //right side
        ctx.fillText("Time: " + Math.round(game.frameNumber / 60), 920, 30);
        ctx.fillText("Points:" + game.player.points, 920, 60);
        //Display results
        if (game.trackPosition > game.finishline) {
            ctx.fillText("WINNER", 450, 120);
            ctx.fillText(game.winner, 450, 150);
            if (game.trackPosition > game.finishline + 1000) { //new
                this.restart()
            }
        }

    }
}

var game = new Game();

/**
 * The main gameloop. Calls for updates on objects, terrain and ui text. Checks for gameplay conditions.
 * Takes no arguments.
 * There is no return value. 
 */
function loop() {

    game.update();
    game.draw();

    //Does not allow the player to go out of bounds.
    if (game.player.x < 0)
        game.restart();

    //Goal position
    if (game.trackPosition > game.finishline && !game.finish) {
        game.goal();
    }

    // Does not allow reverse driving
    if (game.speed < 0) {
        game.speed = 0;
    }
    //Upper limit for player
    if (game.player.y < -10) {
        game.player.y = 0
    }

    //upper limit for ai
    if (game.aiPlayers.y < -10) {
        game.aiPlayer.y = 0
    }

    //Time counter
    game.frameNumber += 1;


    // can't make this one work inside a class/function object
    requestAnimationFrame(loop);
}
loop();
