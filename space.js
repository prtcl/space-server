
(function(self, args){

    /*

        Space.js / Dozen Dimension Duo

        The [space] object contains the players current position in 3D space { x: 0, y: 0, z: 0 },
        an array of N number of Gravity Point objects, and an array of N number synthesis values.

        Each Gravity Point object contains it's coordinate position in 3D space, and a single synthesis value.

        It is implied that the current Space has a bounds of -1. to 1. in each dimension.

        The players current position is incremented via [space].move(x, y, z)

    */

    var N_DIMENSIONS = 3, // number of dimensions we are navigating
        N_POINTS = args[1] || 10; // number of gravity points to populate

    self.autowatch = 1; // reload the JS file for development
    self.inlets = 1; // number of [space] inlets
    self.outlets = 1; // number of [space] outlets
    self.position = {}; // the current position in 3D space
    self.points = []; // an array of Gravity Point objects
    self.values = []; // the current synthesis space as interpolated from all points

    /*
        Simple random range function that returns a float between min and max.
    */
    function rand (min, max) {
        return Math.random() * (max - min) + min;
    }

    /*

        A single Gravity Point object.

        Contains it's coordinate position in 3D space and a single random synthesis value,
        which is scaled by this point's distance from the players current position.

        The .distance() method finds the distance from [space].position in 3D space.

        The .value() method returns this objects interpolated synthsis value.

    */
    function GravityPoint (args) {

        this.x = rand(-1, 1);
        this.y = rand(-1, 1);
        this.z = rand(-1, 1);

        this.val = parseInt(rand(0, 1024));

        this.distance = function(){
            var x = (this.x - self.position.x),
                y = (this.y - self.position.y),
                z = (this.z - self.position.z);
            return Math.sqrt((x * x) + (y * y) + (z * z)) / N_DIMENSIONS;
        }

        this.value = function(){
            return parseInt(this.val * (this.distance() - 2 + 1) * -1);
        }

    }

    /* 
        Center [space].position and generate N_POINTS of Gravity Points
    */
    function init () {
        self.position = { x: 0, y: 0, z: 0 };
        self.points = [];
        for (var i = 0; i < N_POINTS; i++) {
            self.points.push(new GravityPoint());
        }
    }

    self.loadbang = function(){
        init();
        post('Space is ready\n');
    };

    self.reset = function(){
        init();
    };

    /*
        [space].move() sets the playrs current position in 3D space,
        and generates a new array of synthesis values which is sent to outlet 1.
    */
    self.move = function(x, y, z){

        self.position.x = x;
        self.position.y = y;
        self.position.z = z;
        
        self.values = [];

        self.points.forEach(function(point, i){
            self.values[i] = point.value();
        });

        outlet(0, self.values);

    };
    
})(this, jsarguments);
