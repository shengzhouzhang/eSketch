function Line(canvas, options, equipment) {
  
  Element.call(this);
  
  Line.canvas = canvas;
  this.type = "line";
  this.id = null;
  this.layer = options.layer;
  this.x = options.x;
  this.y = options.y;
  this.equipment = equipment;
  var obj = this;
  
  this.render(options);
};

Line.prototype = new Element();
Line.prototype.constructor = Line;

Line.prototype.render = function(options) {
  
  //console.log(options.path);
                            
  this.element = Line.canvas.path().attr({opacity: .5});
  
  this.element.attr({
    path: [
      ["M", options.path[0][1] + this.equipment.x, options.path[0][2] + this.equipment.y],
      ["L", options.path[1][1] + this.equipment.x, options.path[1][2] + this.equipment.y]]
  });
};

Line.prototype.fadeOut = function() {
  
  this.element.attr({opacity: .5});
};

Line.prototype.fadeIn = function() {
  
  this.element.attr({opacity: 1});
};