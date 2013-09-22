function Equipment(canvas, options) {
  
  Equipment.canvas = canvas;
  this.type = "equipment";
  this.id = null;
  this.layer = options.layer;
  this.window = options.window;
  this.grade = options.grade;
  this.url = options.url;
  this.x = options.x;
  this.y = options.y;
  this.width = options.width;
  this.length = options.length;
  this.youtube = options.youtube;
  this.wikipedia = options.wikipedia;
  this.anchors = [];
  this.slots = [];
  this.links = [];
  this.status = Equipment.StatusList.Normal;
  
  var obj = this;
  
  this.set = this.draw(options);
  
  this.transform = this.applyTransform();
  this.transform.drawHandles();
  this.transform.hideHandles();
  
  if (options.components) {
    this.drawComponent(options);
  }
  
  if (this.layer === undefined)
    this.element.hide();
  
  // click event mouse down
  this.element.mousedown(function() {
    
    
    if (Equipment.ActivitedEquipment)
      Equipment.ActivitedEquipment.deactivate();
      
    obj.activite();
  });
  
  // click event mouse up
  this.element.mouseup(function() {
    
    Anchor.UnactiviteMagnet();
  });
  
};

/*
 * ***********************
 * Equipment's attributes
 * ***********************
 */

Equipment.StatusList = {Normal: "nromal", Activited: "activited"};

Equipment.ActivitedEquipment = null;

/*
 * ***********************
 * Equipment's methods
 * ***********************
 */

// draw equipment, anchors, and slots
Equipment.prototype.draw = function(options) {
  
  var obj = this;
  
  var set = Equipment.canvas.set();
    
  this.element = Equipment.canvas.image(this.url, this.x, this.y, this.width, this.length);
  
  set.push(this.element);
  
  // draw anchors
  if (options.anchors) {
    
    options.anchors.forEach(function(anchor) {
      
      var anchor = new Anchor(Equipment.canvas, {layer: anchor.layer, x: anchor.x + obj.x, y: anchor.y + obj.y, radius: anchor.radius, opacity: anchor.opacity, equipment: obj});
      
      anchor.id = obj.anchors.length;
 
      obj.anchors.push(anchor);
      set.push(anchor.element);
    });
  }
  
  // draw links
  if (options.links) {
    
    options.links.forEach(function(link) {
    
      var link = new Link(Equipment.canvas, {layer: link.layer, x: obj.x + link.x, y: obj.y + link.y, width: link.width, height: link.height, radius: link.radius, location: link.location});
      
      link.id = obj.links.length;
      obj.links.push(link);
      set.push(link.element);
    });
  }
  
  // draw slots
  if (options.slots) {
    
    options.slots.forEach(function(slot) {
      
      var slot = new Slot(Equipment.canvas, {layer: slot.layer, x: obj.x + slot.x, y: obj.y + slot.y, width: slot.width, height: slot.height, text: slot.text});
      
      slot.id = obj.slots.length;
      
      obj.slots.push(slot);
      set.push(slot.element);
      
      if (slot.textElement)
        set.push(slot.textElement);
      
    });
  }
  
  return set;
};

Equipment.prototype.drawComponent = function(options) {
  
  var obj = this;
  
  var sets = [];
  
  for (var i = 0; i < options.components.length; i++) {
    
    var component = options.components[i];
    
    var set = Equipment.canvas.set();
    
    var element = Equipment.canvas.image(component.url, this.x + component.x, this.y + component.y, component.width, component.length);
    
    element.toBack();
    
    set.push(element);
    
    if (component.anchors) {
      
      component.anchors.forEach(function(anchor) {
        
        var anchor = new Anchor(Equipment.canvas, {layer: anchor.layer, x: obj.x +  anchor.x + component.x, y: obj.y + anchor.y + component.y, radius: anchor.radius, opacity: anchor.opacity, equipment: component});
        
        anchor.id = obj.anchors.length;
        
        obj.anchors.push(anchor);
        set.push(anchor.element);
      });
    }
    
    sets.push(set);
  }
  
  this.components = {};
 
  this.components.set = sets[0];
  this.components.transform = new Transform(Equipment.canvas,{set: this.components.set}, function(transform, event) {
    
  });
  
  this.components.transform.handles = this.transform.handles;
  this.components.transform.center = this.transform.center;
  
  var ox;
  
  var maxX = this.components.set[0].attr("x") + this.width * 0.15;
  var minX = this.components.set[0].attr("x") - this.width * 0.45;
  var cx, cx2;
  
  this.components.set[0].drag(function(dx, dy, x, y) {
    
    var sign = 1;
    
    if (obj.transform.history) {
      
      var history = obj.transform.history.toTransformString();
      
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
      
      this.attr({x: cx});
      obj.components.set[1].attr({cx: cx2});
    }
    
  }, function(x, y) {
  
    ox = this.attr("x");
    ox2 = obj.components.set[1].attr("cx");
    
  }, function() {
  
  });
  
  this.transform.canScale = false;
};

Equipment.prototype.applyTransform = function() {
  
  var obj = this;
  
  var transform = new Transform(Equipment.canvas, {set: this.set}, function(transform, event) {
    
    switch (event.name) {

      case "drag start":
        break;
      case "drag":
        
        Anchor.ActiviteMagnet();
        
        obj.links.forEach(function(link) {
          
          link.updateHooked();
        });
        
        // update components
        if (obj.components)
          obj.components.transform.translate({dx: event.dx, dy: event.dy});
        
        
        // update linked equipments
        obj.executeLinked([obj], function(item) {
          
          item.transform.translate({dx: event.dx, dy: event.dy});
          
          if (item.components)
            item.components.transform.translate({dx: event.dx, dy: event.dy});
          
          item.links.forEach(function(link) {
            
            link.updateHooked();
          });
        });
        
        
        
        break;
      case "drag end":
        
      if (obj.components)
        obj.components.transform.transformDone();
      
        obj.executeLinked([obj], function(item) {
          
          if (item.components)
            item.components.transform.transformDone();
          
          item.transform.transformDone();
          
          item.updateCenter();
        });
        
        break;
      case "rotate start":
        
        break;
      case "rotate":
        
        if (obj.components)
          obj.components.transform.rotate({
            degree: event.degree,
            x: event.centerX, 
            y: event.centerY
          });
        
        obj.executeLinkedbyGrade([obj], function(item) {
          
          item.rotate({
            degree: event.degree,
            x: event.centerX, 
            y: event.centerY
          });
        });
        
        obj.links.forEach(function(link) {
        
          link.updateHooked();
        });
        
        break;
      case "rotate end":
        
        if (obj.components)
          obj.components.transform.transformDone();
        
        obj.executeLinkedbyGrade([obj], function(item) {
          
          if (item.components)
            item.components.transform.transformDone();
          
          item.transform.transformDone();
          
          item.updateCenter();
        });
        
        break;
      case "scale start":
        
        //var odx = obj.transform
        break;
      case "scale":
        
        obj.executeLinked([obj], function(equipment, link) {
            
          if (link.linked.length > 0) {
            
            Magnet.pull(link.linked[0], link);
          }
        });
        
        break;
      case "scale end":
        
        if (obj.components)
          obj.components.transform.transformDone();
        
        obj.executeLinked([obj], function(item) {
          
          if (item.components)
            item.components.transform.transformDone();
          
          item.transform.transformDone();
          
          item.updateCenter();
        });
        
        break;
      default:
        break;
    }
  });
  
  return transform;
};

// active an equipment to transform
Equipment.prototype.activite = function() {
  
  if (this.status !== Equipment.StatusList.Activited) {
    
    this.status = Equipment.StatusList.Activited;
    
    this.transform.showHandles();
    
    Equipment.ActivitedEquipment = this;
  }
};

// deactive an equipment
Equipment.prototype.deactivate = function() {
  
  if (this.status !== Equipment.StatusList.Normal) {
    
    this.status = Equipment.StatusList.Normal;
    this.transform.hideHandles();
    Equipment.ActivitedEquipment = null;
  }
};

Equipment.prototype.updatePositions = function(list) {
  
  this.anchors.forEach(function(anchor) {
    
    if (anchor.linked.length != 0 && list.indexOf(anchor.linked[0].equipment) === -1) {
      
      anchor.linked[0].equipment.transform.translate({
        x: anchor.positionX() + anchor.linked[0].distanceX(), 
        y: anchor.positionY() + anchor.linked[0].distanceY()
      });
      
      list.push(anchor.linked[0].equipment);
      
      anchor.linked[0].equipment.updatePositions(list);
    }
  });
}

Equipment.prototype.executeLinked = function(list, method) {
  
  this.anchors.forEach(function(anchor) {
    
    if (anchor.linked.length != 0 && list.indexOf(anchor.linked[0].equipment) === -1) {
      
      method(anchor.linked[0].equipment, anchor);
      
      list.push(anchor.linked[0].equipment);
      
      anchor.linked[0].equipment.executeLinked(list, method);
    }
  });
};

Equipment.prototype.executeLinkedbyGrade = function(list, method) {
  
  this.anchors.forEach(function(anchor) {
    
    if (anchor.linked.length != 0 && 
        list.indexOf(anchor.linked[0].equipment) === -1 && 
        (anchor.linked[0].equipment.grade > anchor.equipment.grade)) {
      
      method(anchor.linked[0].equipment);
      
      list.push(anchor.linked[0].equipment);
      
      anchor.linked[0].equipment.executeLinkedbyGrade(list, method);
    }
  });
};

Equipment.prototype.updateCenter = function() {
  
  var max = -1;
  var obj = this;
  var center;
  
  // find the rotate center
  obj.anchors.forEach(function(anchor) {
    
    if (anchor.linked.length != 0 && anchor.linked[0].equipment.grade <= obj.grade) {
      
      if (max === -1 || 
          anchor.linked[0].equipment.grade < max) {
        
        max = anchor.linked[0].equipment.grade; 
        center = anchor.linked[0];
      }
    }
  });
          
  if ((obj.center === undefined || obj.center === null) || obj.grade > center.equipment.grade)
    obj.center = center;
  
  if (obj.center !== undefined && obj.center !== null)
    obj.transform.moveCenter({
      x: obj.center.positionX(),
      y: obj.center.positionY()
    });
};

Equipment.prototype.rotate = function (options) {
  
  this.transform.rotate({
    degree: options.degree, 
    center: {
      x: options.x, 
      y: options.y
    }
  });
  
  if (this.components)
    this.components.transform.rotate({
      degree: options.degree,
      center: {
        x: options.x, 
        y: options.y
      }
    });
};

Equipment.prototype.fadeOut = function() {
  
  this.disable = true;
  
  this.element.attr({opacity: .5});
  
  if (this.components)
    this.components.set[0].attr({opacity: .5});
};

Equipment.prototype.fadeIn = function() {
  
  this.disable = true;
  
  this.element.attr({opacity: 1});
  
  if (this.components)
    this.components.set[0].attr({opacity: 1});
};

Equipment.prototype.transformString = function() {
  
  if (this.transform.history)
    return this.transform.history.toTransformString();
  else
    return ""; 
};

