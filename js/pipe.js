function Pipe(canvas, options) {
  
  Element.call(this);
  
  Pipe.canvas = canvas;
  this.type = "pipe";
  this.layer = options.layer;
  this.x = options.x;
  this.y = options.y;
  this.width = options.width;
  this.height = options.height;
  this.color = options.color;
  this.anchors = [];
  this.slots = [];
  this.links = [];
  this.degree = 0;
  this.scale = {x: 1, y: 1};
  
  this.element = Pipe.canvas.rect(this.x, this.y, this.width, this.height).attr({fill: this.color, opacity: .6});
  
  Pipe.pipes.push(this);
  
  console.log("Pipe");
};

Pipe.prototype = new Element();
Pipe.prototype.constructor = Pipe;

Pipe.pipes = [];

Pipe.prototype.drawLines = function(options) {
  
  
  options.lines.forEach(function(data) {
    
    var line = Pipe.canvas.path().attr({opacity: .5});
    
    line.attr({
      path: data
    });
    
    this.lines.push(line);
  });
};

Pipe.prototype.fadeOut = function() {
  
  this.disable = true;
  
  this.element.attr({opacity: .5});
};

Pipe.prototype.fadeIn = function() {
  
  this.disable = true;
  
  this.element.attr({opacity: 1});
};