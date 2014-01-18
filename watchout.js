$(document).ready(function() {

  /****************************
    Game Options Initialized
  *****************************/

  var gameOptions = {
    height: 450,
    width: 700,
    nEnemies: 30,
    padding: 20
  };

  var gameStats = {
    score: 0,
    bestScore: 0
  };

  /****************************
    Axes Initialized
  *****************************/

  var axes = {
    x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
    y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
  };

  /****************************
    Game Board
  *****************************/

  var gameBoard = d3.select('.container').append('svg:svg')
                    .attr('width', gameOptions.width)
                    .attr('height', gameOptions.height);

  var updateBestScore = function() {
    gameStats.bestScore = _.max([gameStats.bestScore, gameStats.score]);
    d3.select('#best-score').text(gameStats.bestScore.toString());
  };

  var updateScore = function() {
    d3.select('#current-score').text(gameStats.score.toString());
  };


  /****************************
    Enemies Functions
  *****************************/

  var createEnemies = function() {
    return _.range(0,gameOptions.nEnemies).map(function(i) {
      return {
        id: i,
        x: Math.random()*100,
        y: Math.random()*100
      };
    });
  };

  var render = function(enemy_data) {

    var enemies = gameBoard.selectAll('circle.enemy')
                    .data(enemy_data, function(d) {
                      return d.id;
                    });

    enemies.enter().append('svg:circle').attr('class', 'enemy').attr('cx', function(enemy) {
      return axes.x(enemy.x); // how does this parameter fit into the axes.x call
    }).attr('cy', function(enemy) {
      return axes.y(enemy.y);
    }).attr('r', 50);

    enemies.exit().remove();
  };


  var gameTurn = function() {
    var newEnemyPositions = createEnemies();
    render(newEnemyPositions);
  };

  gameTurn();
  setInterval(gameTurn, 1000);
  










});
  