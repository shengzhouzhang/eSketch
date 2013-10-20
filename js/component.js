function Component(canvas, options, equipment) {
  
  Element.call(this);
  
  Component.canvas = canvas;
  this.equipment = equipment;
  this.layer = options.layer;
  this.x = options.x;
  this.y = options.y;
  this.width = options.width;
  this.height = options.height;
  this.url = options.url;
  this.anchors = [];
  
  this.render(options);
};

Component.prototype = new Element();
Component.prototype.constructor = Component;

Component.prototype.render = function(options) {
  
  this.draw(options);
  
  this.transform = this.applyTransform();
  
};

Component.prototype.draw = function(options) {
  
  var component = this;
  
  var set = Component.canvas.set();
  
  this.element = Component.canvas.image(this.url, this.x, this.y, this.width, this.height);
  
  set.push(this.element);
  
  if (options.anchors) {
    
    options.anchors.forEach(function(anchor) {
      
      var anchor = new Anchor(Component.canvas, anchor, component);
      
      anchor.id = component.equipment.anchors.length;
      component.anchors.push(anchor);
      component.equipment.anchors.push(anchor);
      
      set.push(anchor.element);
      
    });
  }
  
  this.set = set;
};

Component.prototype.applyTransform = function() {
  
  var component = this;
  
  var transform = new Transform(Component.canvas,{set: this.set}, function(transform, event) {
    
  });
  
  transform.handles = this.equipment.transform.handles;
  transform.center = this.equipment.transform.center;
  
  var ox;
  
  var maxX = this.element.attr("x") + this.width * 0.15;
  var minX = this.element.attr("x") - this.width * 0.45;
  var cx, cx2;
  
  //
  this.element.drag(function(dx, dy, x, y) {
    
    var sign = 1;
    
    if (transform.history) {
      
      var history = transform.history.toTransformString();
      
      if (history.indexOf("r") !== -1) {
        
        var degree = history.substring(history.indexOf("r"));
        
        degree = degree.substring(1, degree.indexOf(","));
        
        degree = degree % 360;
        
        if (degree > 90 && degree < 270)
          sign = -1;
      }
    }
    
    cx = ox + dx * sign;
    cx2 = ox2 + dx * sign;
    
    if (cx > minX && cx < maxX) {
      
      component.element.attr({x: cx});
      component.set[1].attr({cx: cx2});
    }
    
    component.equipment.checkHiddenPoint();
    
  }, function(x, y) {
    
    ox = component.element.attr("x");
    ox2 = component.set[1].attr("cx");
    
  }, function() {
    
  });
  
  return transform;
};

Component.prototype.translate = function (options) {
  
  if (options.x !== undefined && options.y !== undefined)
    this.transform.translate({x: options.x, y: options.y});
  else if (options.dx !== undefined && options.dy !== undefined)
    this.transform.translate({dx: options.dx, dy: options.dy});
};

Component.prototype.rotate = function (options) {
  
  console.log(options);
  this.transform.rotate({
    degree: options.degree, 
    center: {
      x: options.x, 
      y: options.y
    }
  });
};

Component.prototype.scale = function (options) {
  
  this.transform.scale({
    x: options.x,
    y: options.y
  });
};


Component.prototype.show = function(layer) {
  
  if (this.layer != layer) {
   
   // hide everything
    this.element.hide();
    
    this.anchors.forEach(function(anchor) {
      
      if (anchor.layer != layer)
        anchor.hide();
      else
        anchor.show();
    });
    
  } else {
   
    this.element.show();
    
    this.anchors.forEach(function(anchor) {
      
      if (anchor.layer != layer)
        anchor.hide();
      else
        anchor.show();
    });
  }
};

Component.prototype.fadeOut = function() {
  
  this.element.attr({opacity: .5});
};

Component.prototype.fadeIn = function() {

  this.element.attr({opacity: 1});
};
