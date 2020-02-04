// Interpolation between two numbers a and b.
// https://love2d.org/wiki/General_math

function utils() {
    this.terrainHeightmap = [];

    /**
     * Interpolation between two numbers a and b.
     * https://love2d.org/wiki/General_math
     * Returns a number.
     * @param {number} a
     * @param {number} b
     * @param {number} t
     */
    this.lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;

    /**
    * Creates an array of 255 random numbers that are used to draw the terrain. 
    * init takes no argument.
    * There is no return value.
    */
    this.init = function () {
        while (this.terrainHeightmap.length < 255) {
            while (this.terrainHeightmap.includes(val = Math.floor(Math.random() * 255)));
            this.terrainHeightmap.push(val);
        }
    }

    /**
    * Calls the lerp function with values from the terrainHeightmap to calculate 
    * noise takes x as the argument.
    * The return value is two numbers used as coordinates.
    * @param {number} x - A number (trackPosition + tmp * fluctuation) * 0.25.
    */
    // Simplex / Perlin Noise algorithm
    this.noise = x => {
        x = x * 0.01 % 254;
        return this.lerp(this.terrainHeightmap[Math.floor(x)], this.terrainHeightmap[Math.ceil(x)], x - Math.floor(x));
    };

    /**
    * iteratorLandscapeCoordinates creates the lines that is later drawn onto the canvas in game.js.
    * The return value is an array with x and y coordinates.
    * Global variables: terrainEngine, trackPosition.
    * @param {number} yStartlevel - A number between 0-1 that determines the starting point of the line.
    * @param {number} fluctuation - A number that determines the amount of fluctuation of the line.
    */
    this.iteratorLandscapeCoordinates = function(yStartLevel, fluctuation) {
        return function () {
            let i = 0;

            return {
                next() {
                    if (i < canvas.width) {
                        let tmp = i;
                        i++;
                        return { value: [tmp, canvas.height * yStartLevel - game.terrainEngine.noise(game.trackPosition + tmp * fluctuation) * 0.25], done: false };
                    } else {
                        return { done: true };
                    }
                }
            }
        }
    }

    this.iterableMountains = {
        [Symbol.iterator]: this.iteratorLandscapeCoordinates(0.5, 3) //0.5,3
    }

    this.iterableTrees = {
        [Symbol.iterator]: this.iteratorLandscapeCoordinates(0.8, 6) //0.8,6
    };

    this.iterableGround = {
        [Symbol.iterator]: this.iteratorLandscapeCoordinates(1, 1)
    };
}



