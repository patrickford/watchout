$(document).ready(function() {
  debugger;
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
        x: gameOptions.width * 0.5,
        y: gameOptions.height * 0.5
      });
      this.setUpDragging();
      return this;
    };

    instance.getX = function() {
      return this.x;
    };

    instance.setX = function(x) {
      var minX = gameOptions.padding;
      var maxX = gameOptions.width - gameOptions.padding;
      if (x <= minX) {
        x = minX;
      }
      if (x >= maxX) {
        x = maxX;
      }
      this.x = x;
    };

    instance.getY = function() {
      return this.y;
    };

    instance.setY = function(y) {
      var minY = gameOptions.padding;
      var maxY = gameOptions.height - gameOptions.padding;
      if (y <= minY) {
        y = minY;
      }
      if (y >= maxY) {
        y = maxY;
      }
      this.y = y;
    };

    instance.transform = function(opts) {
      this.angle = opts.angle || this.angle;
      this.setX(opts.x || this.x);
      this.setY(opts.y || this.y);
      console.log(this.getX(), this.getY());
      this.el.attr('transform', ("rotate(" + this.angle + "," + this.getX() + "," + this.getY() + ") ") + ("translate(" + (this.getX()) + "," + (this.getY()) + ")"));
    };

    instance.moveAbsolute = function(x, y) {
      this.transform({
        x: x,
        y: y
      });
    };

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
      var drag = d3.behavior.drag().on('drag', dragMove);
      console.log(this.el);
      return drag.call(this.el);
    };

    return instance;
  }();

  var players = [];
  players.push(player.render(gameBoard));


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
    }).attr('r', 0);

    enemies.exit().remove();

    var checkCollision = function(enemy, collidedCallback) {
      return _(players).each(function(player) {
        var radiusSum = parseFloat(enemy.attr('r')) + player.r;
        var xDiff = parseFloat(enemy.attr('cx')) - player.x;
        var yDiff = parseFloat(enemy.attr('cy')) - player.y;
        var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
        if (separation < radiusSum) {
          return collidedCallback(player, enemy);
        }
      });
    };

    onCollision = function() {
      updateBestScore();
      gameStats.score = 0;
      return updateScore();
    };

    tweenWithCollisionDetection = function(endData) {
      var enemy = d3.select(this);

      var startPos = {
        x: parseFloat(enemy.attr('cx')),
        y: parseFloat(enemy.attr('cy'))
      };

      var endPos = {
        x: axes.x(endData.x),
        y: axes.y(endData.y)
      };

      return function(t) {
        checkCollision(enemy, onCollision);
        var enemyNextPos = {
          x: startPos.x + (endPos.x - startPos.x) * t,
          y: startPos.y + (endPos.y - startPos.y) * t
        };
        return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
      };
    };

    enemies.transition().duration(500).attr('r', 10)
      .transition().duration(2000)
      .tween('custom', tweenWithCollisionDetection);
  };

  var play = function() {

    var gameTurn = function() {
      var newEnemyPositions = createEnemies();
      return render(newEnemyPositions);
    };

    var increaseScore = function() {
      gameStats.score += 1;
      return updateScore();
    };

    gameTurn();
    setInterval(gameTurn, 2000);
    setInterval(increaseScore, 50);
  };

  play();

});