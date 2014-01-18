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

  var player = function() {

    var instance = {
      path: 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z',
      fill: '#ff6600',
      x: 0,
      y: 0,
      angle: 0,
      r: 5
    };

    instance.render = function(to) {
      this.el = to.append('svg:path').attr('d', this.path).attr('fill', this.fill);
      this.transform({
        x: this.gameOptions.width * 0.5,
        y: this.gameOptions.height * 0.5
      });
      this.setUpDragging();
    };

    instance.getX = function() {
      return this.x;
    };

    instance.setX = function(x) {
      var minX = this.gameOptions.padding;
      var maxX = this.gameOptions.width - this.gameOptions.padding;
      if (x <= minX) {
        x = minX;
      }
      if (x >= maxX) {
        x = maxX;
      }
    };

    instance.getY = function() {
      return this.y;
    };

    instance.setY = function(y) {
      var minY = this.gameOptions.padding;
      var maxY = this.gameOptions.height - this.gameOptions.padding;
      if (y <= minY) {
        y = minY;
      }
      if (y >= maxY) {
        y = maxY;
      }
    };

    instance.transform = function(opts) {
      this.angle = opts.angle || this.angle;
      this.setX(opts.x || this.x);
      this.setY(opts.y || this.y);
      this.el.attr('transform', ("rotate(" + this.angle + "," + (this.getX()) + "," + (this.getY()) + ") ") + ("translate(" + (this.getX()) + "," + (this.getY()) + ")"));
    };

    instance.moveAbsolute = function(x, y) {
      this.transform({
        x: x,
        y: y
      });
    };

  /*****  LOOK UP MATH HERE *******/
    instance.moveRelative = function(dx, dy) {
      this.transform({
        x: this.getX() + dx,
        y: this.getY() + dy,
        angle: 360 * (Math.atan2(dy, dx) / (Math.PI * 2))
      });
    };

    instance.setUpDragging = function() {
      var _this = this;
      var dragMove = function() {
        return _this.moveRelative(d3.event.dx, d3.event.dy);
      };
      var drag  = d3.behaviour.drag().on('drag', dragMove);
      return this.el.call(drag);
    };

    return instance;
  };

  var players = [];

  players.push(player().render(gameBoard));


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
  