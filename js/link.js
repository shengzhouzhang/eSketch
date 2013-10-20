function Link(canvas, options, equipment) {
  
  Element.call(this);
  
  Link.canvas = canvas;
  this.type = "link";
  this.id = null;
  this.layer = options.layer;
  this.x = options.x;
  this.y = options.y;
  this.location = options.location;
  this.line = null;
  this.hook = null;
  this.hooking = false;
  this.source = null;
  this.target = null;
  this.equipment = equipment;
  
  if (options.radius) {
    
    this.radius = options.radius;
    
    this.element = Link.canvas.circle(this.x, this.y, this.radius).attr({fill: "yellow"});
    
    Link.targets.push(this);
    
  } else {
    
    this.width = options.width;
    this.height = options.height;
    
    this.element = Link.canvas.rect(this.x, this.y, this.width, this.height).attr({fill: "yellow"});
    
    var obj =  this;
    
    this.element.drag(function(dx, dy, x, y, event) {
      
      obj.line.attr({
        path: [
          ["M", obj.positionX(), obj.positionY()],
          ["L", x - obj.width, y - obj.height]
        ]
      });
      
      obj.hook.attr({x: x - obj.width * 3/2, y: y - obj.height * 3/2});
      
      obj.hookPipe();
      
    }, function(x, y) {
      
      obj.drawLine();
      
    }, function() {
      
      obj.reset();
    });
  }
  
  this.element.undragable = true;
  
  if (this.layer === undefined)
    this.element.hide();
};

Link.prototype = new Element();
Link.prototype.constructor = Link;

Link.targets = [];

Link.prototype.drawLine = function() {
  
  this.hooking = true;
  
  if (this.line === null)
    this.line = Link.canvas.path().attr({"stroke-dasharray": "--", opacity: .5});
  else
    this.line.show();
  
  this.element.toFront();
  
  if (this.hook === null) {
    
    this.hook = Link.canvas.rect(this.x, this.y, this.width, this.height).attr({fill: "yellow"});
  } else {
    
    this.hook.attr({x: this.x, y: this.y});
    this.hook.show();
  }
};

Link.prototype.hookPipe = function() {
  
  var obj = this;
  
  Link.targets.forEach(function(target) {
  
    if (Math.abs(obj.hook.attr("x") - target.positionX()) < 10 &&
        Math.abs(obj.hook.attr("y") - target.positionY()) < 10) {
      
      target.element.attr({fill: "red"});
      
      return;
        
    } else {
      
      target.element.attr({fill: "yellow"});
    }
  });
};

Link.prototype.reset = function() {
  
  var obj = this;
  this.hooking = false;
  
  var hooked = false;
  
  for (var i = 0; i < Link.targets.length; i++) {
    
    if (Math.abs(obj.hook.attr("x") - Link.targets[i].positionX()) < 10 &&
        Math.abs(obj.hook.attr("y") - Link.targets[i].positionY()) < 10) {
      
      
      Link.count++;
      
      var positionY;
      
      if (Link.targets[i].location === "lower")
        positionY = Link.targets[i].positionY() + 20 + 10 * (i + 1);
      else
        positionY = Link.targets[i].positionY() + 20 - 10 * (i + 1);
      
      obj.line.attr({
        path: [
          ["M", obj.positionX(), obj.positionY()],
          ["L", obj.positionX(), positionY],
          ["L", Link.targets[i].positionX(), positionY],
          ["L", Link.targets[i].positionX(), Link.targets[i].positionY()],
        ]
          });
          
          Link.targets[i].source = obj;
        obj.target = Link.targets[i];
        
        Link.targets[i].element.toFront();
        
        hooked = true;
        
        break;
        
      } else {
                    
        Link.targets[i].element.attr({fill: "yellow"});
    }
  }
  
  this.hook.hide();
  
  if (hooked !== true) {
    
    this.line.hide();
    
    this.line.attr({
      path: [
        ["M", this.positionX(), this.positionY()]
      ]
    });
  }
  
};

Link.prototype.updateHooked = function() {
  
  var obj = this;
  
  var positionY;
  
  if (this.source !== null) {
    
    if (this.location === "lower") {
      positionY = this.positionY() + 20 + 10 * (Link.targets.indexOf(this) + 1);
    } else { 
      positionY = this.positionY() + 20 - 10 * (Link.targets.indexOf(this) + 1);
    }
    
    this.source.line.attr({
      path: [
        ["M", this.source.positionX(), this.source.positionY()],
        ["L", this.source.positionX(), positionY],
        ["L", this.positionX(), positionY],
        ["L", this.positionX(), this.positionY()],
      ]
        });
  }
        
        if (this.target !== null) {
        
        if (this.target.location === "lower")
        positionY = this.target.positionY() + 20 + 10 * (Link.targets.indexOf(this.target) + 1);
        else
        positionY = this.target.positionY() - 10 * (Link.targets.indexOf(this.target) + 1);
        
        this.line.attr({
        path: [
        ["M", this.positionX(), this.positionY()],
      ["L", this.positionX(), positionY],
      ["L", this.target.positionX(), positionY],
      ["L", this.target.positionX(), this.target.positionY()],
      ]
    });
  }
};

Link.prototype.show = function() {
  
  if (this.element)
    this.element.toFront().show();
  if (this.hook && this.hooking === true)
    this.hook.toFront().show();
  
  if (this.source)
    this.source.line.toFront().show();  
};

Link.prototype.hide = function() {
  
  if (this.element)
    this.element.hide();
  if (this.line)
    this.line.hide();
  if (this.hook)
    this.hook.hide();
  
  if (this.source)
    this.source.line.hide();
};

Link.prototype.positionX = function() {
  
  if (this.radius)
    return this.element.matrix.x(this.element.attrs.cx, this.element.attrs.cy);
  else
    return this.element.matrix.x(this.element.attrs.x + this.width / 2, this.element.attrs.y + this.height / 2);
};

Link.prototype.positionY = function() {
  
  if (this.radius)
    return this.element.matrix.y(this.element.attrs.cx, this.element.attrs.cy);
  else
    return this.element.matrix.y(this.element.attrs.x + this.width / 2, this.element.attrs.y + this.height / 2);
};