function Pipe(canvas, options) {
  
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
};

Pipe.pipes = [];

Pipe.prototype.fadeOut = function() {
  
  this.disable = true;
  
  this.element.attr({opacity: .5});
};

Pipe.prototype.fadeIn = function() {
  
  this.disable = true;
  
  this.element.attr({opacity: 1});
};