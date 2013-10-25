/*
 * Transform
 */
function Transform(canves, options, callback) {
  
  // require Raphael
  if (canves instanceof Raphael)
    Transform.canves = canves;
  else
    console.log("Transform initial error");
  
  this.elements = options.set;
  
  this.handles = {
    center: null,
    handle: {
      line: null,
      circle: null
    },
    bbox: {
      lines: [],
      boxes: []
    },
  };
  
  var obj = this;
  
  // contain initial position and the position after transform
  this.center = {
    sx: null,  // start position x
    sy: null,  // start position y
    transformX: function() {  // position x after transform
      
      return obj.handles.center.matrix.x(this.sx, this.sy);
    },
    transformY: function() {  // position y after transform
      
      return obj.handles.center.matrix.y(this.sx, this.sy);
    },
    objectX: function() {
      
      return obj.handles.handle.circle.matrix.x(this.sx , this.sy);
    },
    objectY: function() {
      
      return obj.handles.handle.circle.matrix.y(this.sx , this.sy);
    },
    historyX: function() {
      
      if (obj.history)
        return obj.history.x(this.sx, this.sy);
      else
        return this.sx;
    },
    historyY: function() {
      
      if (obj.history)
        return obj.history.y(this.sx, this.sy);
      else
        return this.sy;
    },
    dragable: function() {
      
      obj.handles.center.drag(function(dx, dy, x, y) {
        
        obj.handles.center.transform("t" + ((obj.handles.center.odx || 0) + dx) + "," + ((obj.handles.center.ody || 0) + dy));
        
      }, null, function() {
        
        obj.handles.center.odx = obj.center.transformX() - obj.center.sx;
        obj.handles.center.ody = obj.center.transformY() - obj.center.sy;
      });
    }
  };
  
  this.flipX = 1;
  this.flipY = 1;
  
  // the history of transform
  this.history = this.elements[0].matrix.clone(); 
  
  this.callback = callback;

};

Transform.prototype.getBBox = function() {
  
  var bounds = {
    top: {
      x: 0,
      y: 0
    },
    bottom: {
      x: 0,
      y: 0
    }
  };
  
  this.elements.forEach(function(element) {
  
    var margin = 5;
    var bbox = element.getBBox();
    
    if (bounds.top.x == 0 || bbox.x < bounds.top.x)
      bounds.top.x = bbox.x - margin;
    if (bounds.top.y == 0 || bbox.y < bounds.top.y)
      bounds.top.y = bbox.y - margin;
    
    if (bounds.bottom.x == 0 || bbox.x2 > bounds.bottom.x)
      bounds.bottom.x = bbox.x2 + margin;
    if (bounds.bottom.y == 0 || bbox.y2 > bounds.bottom.y)
      bounds.bottom.y = bbox.y2 + margin;
  });
  
  this.width = Math.abs(bounds.top.x - bounds.bottom.x);
  this.height = Math.abs(bounds.top.y - bounds.bottom.y);
  
  return bounds;
};


Transform.prototype.drawHandles = function() {
  
  var size = 10;
  var obj = this;
  
  var box = this.getBBox();
  
  this.center.sx = (box.top.x + box.bottom.x) / 2;
  this.center.sy = (box.top.y + box.bottom.y) / 2;
  
  this.handles.center = Transform.canves.circle(this.center.sx, this.center.sy, size / 1.5).attr({fill: "white"});
  
  
  this.handles.handle.circle = Transform.canves.circle((box.top.x + box.bottom.x) / 2, box.top.y - Math.max((box.bottom.y - box.top.y) * 0.15, 30), size / 1.5).attr({fill: "white"});
      
  for (var position_1 in box) {
   
    for (var position_2 in box) {
      
      this.handles.bbox.boxes.push(Transform.canves.rect(box[position_1]["x"] - size / 2, box[position_2]["y"] - size / 2, size, size, 0).attr({fill: "white"}));
      
      this.handles.bbox.boxes[this.handles.bbox.boxes.length - 1].type = "corner";
      
      if (position_1 !== position_2) {
        
        this.handles.bbox.lines.push(Transform.canves.path([
          ["M", box[position_1]["x"], box[position_1]["y"]],
          ["L", box[position_2]["x"], box[position_1]["y"]]
        ]).attr({"stroke-dasharray": "--", opacity: .5}).toBack());
        
        this.handles.bbox.lines.push(Transform.canves.path([
          ["M", box[position_1]["x"], box[position_1]["y"]],
          ["L", box[position_1]["x"], box[position_2]["y"]]
        ]).attr({"stroke-dasharray": "--", opacity: .5}).toBack());
        
        
        this.handles.bbox.boxes.push(Transform.canves.rect((box[position_1]["x"] + box[position_2]["x"]) / 2 - size / 2, box[position_2]["y"] - size / 2, size, size, 0).attr({fill: "white"}));
        
        this.handles.bbox.boxes[this.handles.bbox.boxes.length - 1].type = "middleX";
        
        this.handles.bbox.boxes.push(Transform.canves.rect(box[position_1]["x"] - size / 2, (box[position_1]["y"] + box[position_2]["y"]) / 2 - size / 2, size, size, 0).attr({fill: "white"}));
        
        this.handles.bbox.boxes[this.handles.bbox.boxes.length - 1].type = "middleY";
        
      }
    } 
  }
  
  this.handles.size = size;
  
  /*
   * handles' events
   */
  // handle rotate event
  this.rotatable();
  
  // self move event
  this.dragable();
  
  // boxes scale event
  this.scalable();
};

Transform.prototype.dragable = function(option) {
  
  var obj = this;
  
  this.elements.forEach(function(item) {
    
    if (option === false)
      return;
        
    if (item.dragable === false)
      return;
  
    item.drag(function(dx, dy) {
      
      obj.transform({type: "translate", x: dx, y: dy});
      
      // update center
      obj.handles.center.transform("t" + ((obj.handles.center.odx || 0) + dx) + "," + ((obj.handles.center.ody || 0) + dy));
      
      obj.callback(obj, {
        name: "drag",
        dx: dx,
        dy: dy
      });
      
    }, function(x, y) {
    
    }, function() {
      
      obj.transformDone();
      
      obj.callback(obj, {name: "drag end"});
    });
  });
};

Transform.prototype.rotatable = function() {
  
  var obj = this;
  
  var degree;
  var start;
  
  this.handles.handle.circle.drag(function(dx, dy, x, y) {
    
    // rotated angle in degree
    degree = Raphael.angle(obj.center.transformX(), obj.center.transformY(), x, y) - start;
    
    var values = obj.transform({type: "rotate", degree: degree});
    
    obj.callback(obj, {
      name: "rotate",
      degree: values.degree,
      centerX: values.center.x,
      centerY: values.center.y
    });
  
  }, function(x, y) {
    
    // start angle
    start = Raphael.angle(obj.center.transformX(), obj.center.transformY(), x, y);
    
    obj.callback(obj, {
      name: "rotate start",
    });
  
  }, function() {
    
    obj.transformDone();
    
    obj.callback(obj, {
      name: "rotate end"});
  });
};

Transform.prototype.scalable = function() {
  
  var obj = this;
  var size = this.handles.size;
  
  var scaleX;
  var scaleY;

  
  this.handles.bbox.boxes.forEach(function(box) {
  
    box.drag(function(dx, dy, x, y) {
      
      if (obj.canScale === false)
        return;
      
      scaleX = (this.oscaleX + this.operationX * dx) / this.oscaleX;
      scaleY = (this.oscaleY + this.operationY * dy) / this.oscaleY;
      
      switch(this.type) {
       
        case "middleX":
          scaleX = 1;
          break;
        case "middleY":
          scaleY = 1;
          break;
        default:
          scaleX = scaleY;
      }
      
      var result = obj.scale({x: scaleX, y: scaleY});
      
      obj.callback(obj, {
        name: "scale", 
        scale: result
      });
      
    }, function(x, y) {
      
      obj.center.cx = obj.history.x(obj.center.sx , obj.center.sy);
      obj.center.cy = obj.history.y(obj.center.sx , obj.center.sy);
      
      this.oscaleX = Math.abs(
        obj.history.x(this.attr("x"), this.attr("y")) 
        + size / 2 - obj.center.cx);
      
      this.oscaleY = Math.abs(
        obj.history.y(this.attr("x"), this.attr("y"))
        + size / 2 - obj.center.cy);
      
      if (x < obj.center.cx) {
        
        this.operationX = -1;
      } else {
        
        this.operationX = 1;
      }
      
      if (y < obj.center.cy)
        this.operationY = -1;
      else
        this.operationY = 1;
      
      obj.callback(obj, {
        name: "scale start"});
    
    }, function() {
      
   if (scaleX < 0)
       obj.flipX *= -1;
   
   if (scaleY < 0)
     obj.flipY *= -1;
      
      obj.transformDone();
      
      obj.callback(obj, 
          {name: "scale end"}
      );
  });
  });
};



Transform.prototype.translate = function(options) {
  
  var obj = this;

  var dx;
  var dy;
  
  if (options.dx !== undefined && options.dy !== undefined) {
    
    dx = options.dx;
    dy = options.dy;
    
  } else {
    
    dx = options.x - this.center.historyX();
    dy = options.y - this.center.historyY();
    
  }
  
  this.transform({type: "translate", x: dx, y: dy, updateHandle: options.updateHandle}); 
  
  if (options.updateHandle !== false)
    this.handles.center.transform("t" + ((this.handles.center.odx || 0) + dx) + "," + ((this.handles.center.ody || 0) + dy));
  
  return {dx: dx, dy: dy};
};
  
Transform.prototype.rotate = function(options) {

  options.type = "rotate";
  return this.transform(options);
};

Transform.prototype.scale = function(options) {
  
  options.type = "scale";
  return this.transform(options);
};

Transform.prototype.transform = function(options) {
  
  var obj = this;
  
  var string = "";
  
  var center = {};
  var rotate = {};
  var translate = {};
  var scale = {};
  
  if (this.history !== null) {
    
    var invert = this.history.invert();
    
    if (options.center === undefined) {
      
      center.x = invert.x(obj.center.transformX(), obj.center.transformY());
      center.y = invert.y(obj.center.transformX(), obj.center.transformY());
      
    }else {
      
      center.x = invert.x(options.center.x, options.center.y);
      center.y = invert.y(options.center.x, options.center.y);
      
      //center = options.center;
    }
    
    rotate.degree = options.degree;
    
    // remove x and y, only invert the degree
    invert.e = 0;
    invert.f = 0;
    
    translate.x = invert.x(options.x, options.y);
    translate.y = invert.y(options.x, options.y);
    
    //
    scale.x = options.x;
    scale.y = options.y;
    
    string += this.history.toTransformString(); 
    
  } else {
    
    center.x = obj.center.transformX();
    center.y = obj.center.transformY();
    
    translate.x = options.x;
    translate.y = options.y;
    
    scale.x = options.x;
    scale.y = options.y;
  }
  
  switch(options.type) {
   
    case "rotate":
      if (string.indexOf("m") === -1) 
            string += "s" + (obj.flipX < 0 ? (obj.flipX * obj.flipY): obj.flipX) + "," + 1 + ",0,0";
      
      string += "r" + (rotate.degree * (obj.flipX * obj.flipY)) + "," + center.x + "," + center.y;
      break;
    case "translate":

      if (string.indexOf("m") === -1) 
        string += "s" + (obj.flipX < 0 ? (obj.flipX * obj.flipY): obj.flipX) + "," + 1 + ",0,0";
      
      string += "t" + translate.x + "," + translate.y;
      break;
    case "scale":
      
      if (string.indexOf("m") === -1) 
        string += "s" + (obj.flipX < 0 ? (obj.flipX * obj.flipY): obj.flipX) + "," + 1 + ",0,0";
      
      string += "s" + scale.x + "," + scale.y + "," + center.x + "," + center.y;
      break;
    default:
      break;
  }
  
  this.applyTransform(string, options.updateHandle);
  
  switch (options.type) {
   
    case "rotate":
      rotate.center = {
        x: obj.center.transformX(),
        y: obj.center.transformY()
      };
      return  rotate;
    case "translate":
      translate.center = center;
      return translate;
    case "scale":
      scale.center = center;
      return scale;
    default:
      return;
  }
};

Transform.prototype.applyTransform = function(string, updateHandle) {
  
  // transform elements
  this.elements.forEach(function(element) {
    
    element.transform(string);
  });
  
  if (updateHandle === false)
    return;
  
  for (var type in this.handles) {
    
    switch(type) {
      
      case "center":
        if (this.handles[type] !== null)
          this.handles[type].toFront();
        break;
      case "handle":
        
        if (this.handles[type].line !== null)
          this.handles[type].line.transform(string).toFront();
        if (this.handles[type].circle !== null)
          this.handles[type].circle.transform(string).toFront();
        break;
      case "bbox":
        
        if (this.handles[type].line !== null)
          this.handles[type].lines.forEach(function(item) {
            item.transform(string).toFront();
          });
        
        if (this.handles[type].boxes !== null)
          this.handles[type].boxes.forEach(function(item) {
            item.transform(string).toFront();
          });
        
        break;
      default:
        break;
    }
  };
};

Transform.prototype.transformDone = function() {
   
  this.handles.center.odx = this.center.transformX() - this.center.sx;
  this.handles.center.ody = this.center.transformY() - this.center.sy;
  
  // update history
  this.history = this.elements[0].matrix.clone(); 
};

Transform.prototype.showHandles = function() {
    
  for (var type in this.handles) {
    
    switch(type) {
      
      case "center":
        //this.handles[type].show();
        break;
      case "handle":
        this.handles[type].circle.toFront().show();
        break;
      case "bbox":
        
        this.handles[type].lines.forEach(function(item) {
          item.toFront().show();
        });
        
        this.handles[type].boxes.forEach(function(item) {
          item.toFront().show();
        });
        break;
      default:
        break;
    }
  };
};

Transform.prototype.hideHandles = function() {
  
  for (var type in this.handles) {
    
    switch(type) {
      
      case "center":
        this.handles[type].hide();
        break;
      case "handle":
        this.handles[type].circle.hide();
        break;
      case "bbox":
        
        this.handles[type].lines.forEach(function(item) {
          item.hide();
        });
        
        this.handles[type].boxes.forEach(function(item) {
          item.hide();
        });
        break;
      default:
        break;
    }
  };
};



Transform.prototype.updateHandle = function(options) {
  
  var bounds = this.getBBox();
  
  var rects = [];
  var lines = [];
  
  if (options.type === "rotate" || options.type === "translate") {
    
    this.handles.handle.line.transform(options.string).toFront();
    
    this.handles.handle.circle.transform(options.string).toFront();
    
    this.handles.bbox.lines.forEach(function(item) {
      item.transform(options.string).toFront();
    });
    this.handles.bbox.boxes.forEach(function(item) {
      item.transform(options.string).toFront();
    });
    
    this.handles.center.toFront();
    
    return;
  }
    
  for (var position_1 in bounds) {
    
    for (var position_2 in bounds) {
      
      rects.push({
        x: this.history.x(bounds[position_1]["x"] - this.handles.size / 2, bounds[position_2]["y"] - this.handles.size / 2),
        y: this.history.y(bounds[position_1]["x"] - this.handles.size / 2, bounds[position_2]["y"] - this.handles.size / 2)
      });
      
      if (position_1 !== position_2) {
        
        lines.push([
          ["M", bounds[position_1]["x"], bounds[position_1]["y"]],
          ["L", bounds[position_2]["x"], bounds[position_1]["y"]]
        ]);
        
        lines.push([
          ["M", bounds[position_1]["x"], bounds[position_1]["y"]],
          ["L", bounds[position_1]["x"], bounds[position_2]["y"]]
        ]);
        
        
        rects.push({
          x: this.history.x((bounds[position_1]["x"] + bounds[position_2]["x"] - this.handles.size) / 2, bounds[position_2]["y"] - this.handles.size / 2),
          y: this.history.y((bounds[position_1]["x"] + bounds[position_2]["x"] - this.handles.size) / 2, bounds[position_2]["y"] - this.handles.size / 2)});
        
        rects.push({
          x: this.history.x(bounds[position_1]["x"] - this.handles.size / 2, (bounds[position_1]["y"] + bounds[position_2]["y"] - this.handles.size) / 2),
          y: this.history.y(bounds[position_1]["x"] - this.handles.size / 2, (bounds[position_1]["y"] + bounds[position_2]["y"] - this.handles.size) / 2)});
      }
    } 
  }
  
  var i;
  
  for (i = 0; i < rects.length; i++) {
    
    var dx = rects[i].x - this.handles.bbox.boxes[i].attr("x");
    
    var dy = rects[i].y - this.handles.bbox.boxes[i].attr("y");
    
    this.handles.bbox.boxes[i].transform(["T", dx, dy]).toFront();
  }
  
  for (i = 0; i < lines.length; i++) {
    
    this.handles.bbox.lines[i].attr({
      path: lines[i]
    })
      }
  
  var start = {x: (bounds.top.x + bounds.bottom.x) / 2, y: (bounds.top.y + bounds.bottom.y) / 2};
  
  var end = {x: (bounds.top.x + bounds.bottom.x) / 2, y: bounds.top.y - 30}
      
      this.handles.handle.line.attr({
        path: [
          ["M", start.x, start.y],
          ["L", end.x, end.y]
        ]
      });
  
  this.handles.handle.circle.transform([
    "T", 
    end.x - this.handles.handle.circle.attr("cx"), 
    end.y - this.handles.handle.circle.attr("cy")
  ]);
};


Transform.prototype.moveCenter = function(options) {
    
  if (options !== undefined) {
  
    var dx = options.x - this.center.sx;
    var dy = options.y - this.center.sy;
    
    this.handles.center.transform("t" + dx + "," + dy);
  }
};

Transform.prototype.resetCenter = function() {
    
  this.moveCenter({x: this.center.objectX(), y: this.center.objectY()});
  
  this.transformDone();
};

