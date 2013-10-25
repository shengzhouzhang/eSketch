/*
* Transform
*/
function Transform(canves, options, callback) {
  
  // require Raphael
  if (canves instanceof Raphael)
    Transform.canves = canves;
  else
    console.log("Transform initial error");
  
  var bbox = options.set.getBBox(true), margin = 10;
  
  this.attrs = {
    x: bbox.x - margin,
    y: bbox.y - margin,
    x2: bbox.x2 + margin,
    y2: bbox.y2 + margin,
    size: 7,
    color: "white",
    center: { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 },
    rotate: 0,
    scale: { x: 1, y: 1 },
    translate: { x: 0, y: 0 },
    ratio: 1
  };
  
  this.elements = {
    center: null, 
    handle: null, 
    axes: null, 
    bbox: [],
    main: options.set,
    hidden: null
  };
  
  this.elements.bbox.transform = function(data) {
    
    var i;
    
    for (i = 0; i < this.length; i++)
      this[i].transform(data);
  };
  
  this.elements.transform = function(data) {
    
    for (var item in this) {
      
      if (this[item]["transform"])
        this[item].transform(data);
    }
  };
  
  this.history = {
    dx: 0,
    dy: 0,
    rotate: 0
  };
  
  this.callback = callback;
};

Transform.prototype.applyTransform = function() {
  
  var transform = this;
  
  this.elements.main.forEach(function(item) {
  
    if (item.dragable != false) {
      
      item.drag(function(dx, dy) {
        
        transform.transform(["T", dx, dy]);
        
        transform.callback(transform, { name: "drag", dx: dx, dy: dy });
        
      }, function(x, y) {
        
      }, function() {
        
        transform.save();
      });
    }
  });
  
  var degree = 0, sx, sy;
  
  this.elements.handle.drag(function(dx, dy, x, y) {
    
    var bbox = transform.elements.main.getBBox(false);
    
    degree = Raphael.angle(x, y, sx, sy, (bbox.x + bbox.x2) / 2, (bbox.y + bbox.y2) / 2);
    
    console.log(degree);
    
    transform.transform(
       ["R", degree, transform.attrs.center.x, transform.attrs.center.y]
    );
    
  }, function(x, y) {
    
    sx = x;
    sy = y;
  }, function() {
    
    transform.save();
  });
};

Transform.prototype.transform = function(data) {
  
  this.elements.transform(
    ["T", this.history.dx, this.history.dy, "R", this.history.rotate]
    .concat(data)
  );
};

Transform.prototype.save = function() {
  
  this.history = this.elements.hidden.matrix.split();
  
  console.log(this.history);
}

Transform.prototype.updateHandles = function() {
  
  var bbox = this.elements.main.getBBox(false);
  
  this.elements.handle.transform(["T", (bbox.x + bbox.x2) / 2, bbox.y - 3 * size]);
};

Transform.prototype.drawHandles = function() {
  
  var transform = this, size = this.attrs.size, i;
  
  //this.elements.center = Transform.canves.circle(this.attrs.center.x, this.attrs.center.y, size)
    //.attr({fill: this.attrs.color});
  
  this.elements.handle = Transform.canves.circle(this.attrs.center.x, this.attrs.y - 3 * size, size)
    .attr({fill: this.attrs.color});
  
  this.elements.axes = Transform.canves.path([
    ["M", transform.attrs.x, transform.attrs.y],
    ["L", transform.attrs.x2, transform.attrs.y],
    ["L", transform.attrs.x2, transform.attrs.y2],
    ["L", transform.attrs.x, transform.attrs.y2],
    ["L", transform.attrs.x, transform.attrs.y]
  ]).attr({"stroke-dasharray": "--", opacity: .5});
  
  size = Math.round(size * 1.5);
  
  this.elements.bbox.push(
    Transform.canves.rect(transform.attrs.x - size / 2, transform.attrs.y - size / 2, size, size),
    Transform.canves.rect(transform.attrs.x2 - size / 2, transform.attrs.y - size / 2, size, size),
    Transform.canves.rect(transform.attrs.x2 - size / 2, transform.attrs.y2 - size / 2, size, size),
    Transform.canves.rect(transform.attrs.x - size / 2, transform.attrs.y2 - size / 2, size, size),
    Transform.canves.rect(transform.attrs.center.x - size / 2, transform.attrs.y - size / 2, size, size),
    Transform.canves.rect(transform.attrs.x2 - size / 2, transform.attrs.center.y - size / 2, size, size),
    Transform.canves.rect(transform.attrs.center.x - size / 2, transform.attrs.y2 - size / 2, size, size),
    Transform.canves.rect(transform.attrs.x - size / 2, transform.attrs.center.y - size / 2, size, size)
  );
  
  for (i = 0; i < this.elements.bbox.length; i++)
    this.elements.bbox[i].attr({fill: this.attrs.color});
  
  this.elements.hidden = Transform.canves.circle(this.attrs.center.x, this.attrs.center.y, size)
    .attr({fill: this.attrs.color}).hide();
};



Transform.prototype.hideHandles = function() {
  
};

Transform.prototype.scale = function() {
  
};

Transform.prototype.transformDone = function() {
  
};



Transform.prototype.resetCenter = function() {
  
};

Transform.prototype.moveCenter = function() {
  
};

Transform.prototype.showHandles = function() {
  
};