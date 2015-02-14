// start slingin' some d3 here.

// *Setup the environment
var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20

}



//score

var gameStats = {
  score: 0,
  bestScore: 0
}

// *Setup the game board

// *Axes

var axes = {
  x : d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y : d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

// *Set up board as svg region
d3.select(".board").append('svg:svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);


// Scoreboard

// Player
var Player = function(x, y){
  this.x = x;
  this.y = y;
 // this.angle;
  this.r = 5;

}

Player.prototype.moveRelative = function(dx, dy) {
  console.log('mRel');
  this.setX(this.x + dx);
  this.setY(this.y + dy);
  d3.select("svg").selectAll(".player").data([this])
    .attr('cx', function( p ){return axes.x(p.x); })
    .attr('cy', function( p ){return axes.y(p.y); });
};

Player.prototype.initialize = function() {

  var player = d3.select("svg").selectAll(".player")
    .data([this]);

  player.enter()
    .append('svg:circle')
    .attr('class','player')
    .attr('style', 'fill: blue')
    .attr('cx', function( p ){return p.x; })
    .attr('cy', function( p ){return p.y; })
    .attr('r', 0)
    .transition().duration(1200).attr('r', 10);

  var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on('drag', function(d){

      // check bounds
      d.x = boundX(d.x + d3.event.dx);
      d.y = boundY(d.y + d3.event.dy);

      d3.select(this)
        .attr("cx", d.x)
        .attr("cy", d.y)
    });

  player.call(drag);
};

var boundX = function (x) {
  var minX = gameOptions.padding;
  var maxX = gameOptions.width - gameOptions.padding;
  if ( x < minX ) {
    return minX;
  } else if ( x > maxX ) {
    return maxX;
  } else {
    return x;
  }
};
var boundY = function (y) {
  var minY = gameOptions.padding;
  var maxY = gameOptions.height - gameOptions.padding;
  if ( y < minY ) {
    return minY;
  } else if ( y > maxY ) {
    return maxY;
  } else {
    return y;
  }
};

// *Enemies
var Enemy = function(){
  this.x = Math.random() * 100;
  this.y = Math.random() * 100;
  this.r = 10;
  this.id = Enemy.prototype.count++;
}

Enemy.prototype.count = 0;
Enemy.prototype.reposition = function() {
  this.x = Math.random() * 100;
  this.y = Math.random() * 100;
};

var enemyObjs = [];
for (var e = 0; e < gameOptions.nEnemies; e++){
  enemyObjs.push(new Enemy());
}

// *Render board
var render = function() {

  for (var i = 0; i < enemyObjs.length; i++) {
    enemyObjs[i].reposition();
  }

  var enemies = d3.select("svg").selectAll(".enemy")
    .data(enemyObjs, function(e){return e.id});

  enemies.transition().duration(200)
    .attr('cx', function( enemy ){ return axes.x(enemy.x); })
    .attr('cy', function( enemy ){ return axes.y(enemy.y); });

  enemies.enter()
    .append('svg:circle')
    .attr('class','enemy')
    .attr('cx', function( enemy ){ return axes.x(enemy.x); })
    .attr('cy', function( enemy ){ return axes.y(enemy.y); })
    .attr('r', 0)
    .transition().duration(200).attr('r', 10);
}

var checkCollisions = function() {
  d3.select("svg").selectAll(".enemy").each(function() {
    // console.log(e.x, ', ', e.y);
    var enemy = d3.select(this);
    var player = d3.select("svg").selectAll(".player");
    // console.log("player.x: " + player.attr("cx"));
    // console.log("player.y: " + player.attr("cy"));
    var dist = calcDistance(enemy.attr("cx"), enemy.attr("cy"), player.attr("cx"), player.attr("cy"));
    //console.log("dist: " + dist);
    if (dist < (Number(enemy.attr("r")) + Number(player.attr("r")))) {
      console.log("Direct hit!");
      gameStats.score++;
      console.log(gameStats.score);

    }
  });
};

var calcDistance = function(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
};

// Play the game
var play = function(){
  var playerObj = new Player(axes.x(50), axes.y(50));

  playerObj.initialize();

  // d3.select('svg').append("rect")
  //   .attr("height", 100)
  //   .attr("width", 100)
  //   .attr("x", 10)
  //   .attr("y", 10)
  //   .attr("fill", "green");

  var gameTurn = function (){
    render();
    //checkCollisions();
    // create new enemies array
    // move enemies
    // look for collisions


  };

  // make gameTurn occur every few seconds
  setInterval(checkCollisions, 1);
  setInterval(gameTurn, 1000);
};

play();
