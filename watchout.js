// start slingin' some d3 here.

// *Setup the environment
var gameHeight = 450;
var gameWidth = 700;
var nEnemies = 30;
var padding = 20;

//score

// *Setup the game board

// *Axes

var x = d3.scale.linear().domain([0,100]).range([0,gameWidth]);
var y = d3.scale.linear().domain([0,100]).range([0,gameHeight]);

// *Set up board as svg region
d3.select(".board").append(svg:svg)
  .attr('width', gameWidth)
  .attr('height', gameHeight);


// Scoreboard

// Player
  //  sgv class
  //

// *Enemies


// *Render board

// Play the game
