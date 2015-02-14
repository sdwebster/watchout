// start slingin' some d3 here.

// *Setup the environment
var gameHeight = 450;
var gameWidth = 700;
var nEnemies = 30;
var padding = 20;

//score

// *Setup the game board

// *Axes

var axes = {
  x : d3.scale.linear().domain([0,100]).range([0,gameWidth]),
  y : d3.scale.linear().domain([0,100]).range([0,gameHeight])
};

// *Set up board as svg region
d3.select(".board").append('svg:svg')
  .attr('width', gameWidth)
  .attr('height', gameHeight);


// Scoreboard

// Player
  //  sgv class
  //

// *Enemies
var Enemy = function(){
  this.x = Math.random() * 100;
  this.y = Math.random() * 100;
  this.id = Enemy.prototype.count++;
}

Enemy.prototype.count = 0;
Enemy.prototype.reposition = function() {
  this.x = Math.random() * 100;
  this.y = Math.random() * 100;
};

var newEnemies = [];
for (var e = 0; e < nEnemies; e++){
  newEnemies.push(new Enemy());
}

// *Render board
var render = function() {

  for (var i = 0; i < newEnemies.length; i++) {
    newEnemies[i].reposition();
  }

  var enemies = d3.select("svg").selectAll(".enemy")
    .data(newEnemies, function(e){return e.id});

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
// Play the game

var play = function(){
  var gameTurn = function (){
    render();
    // create new enemies array
    // move enemies
    // look for collisions


  };

  // make gameTurn occur every few seconds
  setInterval(gameTurn, 1000);
};

play();
