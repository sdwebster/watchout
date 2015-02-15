// start slingin' some d3 here.

// Setup the environment
var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 1,
  padding: 20

}

//score

var gameStats = {
  bestScore: 0,
  score: 0,
  collisions: 0,
  prevCollision: false
}

// Setup the game board

// Axes

var axes = {
  x : d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y : d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

// Set up board as svg region
d3.select(".board").append('svg:svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height)
  .style("border", "#8F4700 5px solid");


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
    // .attr('data-colliding', false)
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
    .attr('x', function( enemy ){ return axes.x(enemy.x); })
    .attr('y', function( enemy ){ return axes.y(enemy.y); });

  enemies.enter()
    .append('image')
    .attr('class','enemy')
    .attr('xlink:href', 'NickCage.png')
    .attr('height', '60px')
    .attr('width', '60px')
    .attr('x', function( enemy ){ return axes.x(enemy.x); })
    .attr('y', function( enemy ){ return axes.y(enemy.y); })

  enemies.exit().remove();

  //  .attr('height', '100px');
}



var checkCollisions = function() {
  var collision = false;
  d3.select("svg").selectAll(".enemy").each(function() {
    var enemy = d3.select(this);
    var player = d3.select("svg").selectAll(".player");
    var dist = calcDistance(enemy.attr("x"), enemy.attr("y"), player.attr("cx"), player.attr("cy"));
    if (dist < 30 + Number(player.attr("r"))) {
      collision = true;
      if (!gameStats.prevCollision) {
        enemyObjs.splice(enemyObjs.indexOf(enemy),1);
        gameOptions.nEnemies--;
      }
    }
  });

  if (collision) {
    gameStats.score = 0;
    d3.select("svg").style("background-color", '#CC00CC');

    if (!gameStats.prevCollision) {
      gameStats.collisions++;
    }
  } else {
    d3.select("svg").style("background-color", '#30FFAC');
  }

  //gameStats.prevCollision = true;
  gameStats.prevCollision = collision;

};

d3.timer(checkCollisions);

var calcDistance = function(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
};

var calcScore = function() {
    var scoreBoard = d3.selectAll(".scoreboard");
    scoreBoard.selectAll(".high span")
      .text(gameStats.bestScore);

    scoreBoard.selectAll(".current span")
      .text(gameStats.score);

    scoreBoard.selectAll(".collisions span")
      .text(gameStats.collisions);

    gameStats.score++;
    gameStats.bestScore = Math.max(gameStats.score, gameStats.bestScore);

    console.log("nEnemies: " + gameOptions.nEnemies);

    if (gameStats.score > (gameOptions.nEnemies * 50)) {
      enemyObjs.push(new Enemy());
      gameOptions.nEnemies++;
      console.log("More Cages!");
    }
};

// Play the game
var play = function(){
  var playerObj = new Player(axes.x(50), axes.y(50));

  playerObj.initialize()


  var gameTurn = function (){
    render();
  };

  // make gameTurn occur every few seconds
  setInterval(calcScore, 100);
  setInterval(gameTurn, 1000);
};

play();
