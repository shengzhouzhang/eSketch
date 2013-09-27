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
  
};

Equipment.isLinked = function(equipment_1, equipment_2) {
  
  var isLinked = false;
  
  equipment_1.executeLinked([equipment_1], function(equipment) {
    
    if (equipment === equipment_2) {
      
      isLinked = true;
    }
  });
  
  return isLinked;
};

Equipment.saveAll = function() {
  
  Panel.equipments.forEach(function(equipment) {
    
    equipment.save();
  });
}
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
      
      var anchor = new Anchor(Equipment.canvas, {layer: anchor.layer, x: anchor.x + obj.x, y: anchor.y + obj.y, radius: anchor.radius, opacity: anchor.opacity, equipment: obj, hidden: anchor.hidden});
      
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
    
    set.push(element);
    
    if (component.anchors) {
      
      component.anchors.forEach(function(anchor) {
        
        var anchor = new Anchor(Equipment.canvas, {layer: anchor.layer, x: obj.x +  anchor.x + component.x, y: obj.y + anchor.y + component.y, radius: anchor.radius, opacity: anchor.opacity, equipment: obj});
        
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
  this.set.forEach(function(element) {
  
    element.toFront()
  });
};

Equipment.prototype.applyTransform = function() {
  
  var obj = this;
  
  var transform = new Transform(Equipment.canvas, {set: this.set}, function(transform, event) {
    
    switch (event.name) {

      case "drag start":
        break;
      case "drag":
        
        Anchor.ActiviteMagnet("drag");
        
        obj.links.forEach(function(link) {
          
          link.updateHooked();
        });
        
        // update components
        if (obj.components)
          obj.components.transform.translate({dx: event.dx, dy: event.dy});
        
        
        obj.executeLinked([obj], function(equipment, link) {
          
          if (link.linked.length > 0) {
            
            link.linked[0].equipment.translate({
              x: link.positionX() + link.linked[0].distanceX(), 
              y: link.positionY() + link.linked[0].distanceY()
            });
          }
        });
        
        break;
      case "drag end":
        
        obj.save();
        
        obj.executeLinked([obj], function(equipment) {
          
          equipment.save();
          
          equipment.updateCenter();
        });
        
        Anchor.UnactiviteMagnet("drag");
        
        break;
      case "rotate start":
        
        break;
      case "rotate":
        
        Anchor.ActiviteMagnet("rotate");
        
        if (obj.components)
          obj.components.transform.rotate({
            degree: event.degree,
            x: event.centerX, 
            y: event.centerY
          });
        
        obj.executeLinkedbyGrade([obj], function(equipment) {
          
          equipment.rotate({
            degree: event.degree,
            x: event.centerX, 
            y: event.centerY
          });
          
        }, function(equipment, anchor) {
        
          console.log(1);
          Anchor.Break(anchor);
          
        });
        
        obj.links.forEach(function(link) {
        
          link.updateHooked();
        });
        
        break;
      case "rotate end":
        
        obj.save();
        
        obj.executeLinkedbyGrade([obj], function(equipment) {
          
          equipment.save();
          
          equipment.updateCenter();
        });
        
        Anchor.UnactiviteMagnet("rotate");
        
        break;
      case "scale start":

        break;
      case "scale":
        
        // update linked equipment's position
        obj.executeLinked([obj], function(equipment, link) {
            
          if (link.linked.length > 0) {
            
            link.linked[0].equipment.translate({
              x: link.positionX() + link.linked[0].distanceX(), 
              y: link.positionY() + link.linked[0].distanceY()
            });
          }
        });
        
        break;
      case "scale end":
        
        obj.save();
        
        obj.executeLinked([obj], function(equipment) {
          
          equipment.save();
          
          equipment.updateCenter();
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

// Breadth-first traversal
Equipment.prototype.executeLinked = function(list, method) {
  
  var hasNew = false;
  
  this.anchors.forEach(function(anchor) {
    
    if (anchor.linked.length != 0 && 
        list.indexOf(anchor.linked[0].equipment) === -1) {
      
      method(anchor.linked[0].equipment, anchor);
      
      list.push(anchor.linked[0].equipment);
      
      hasNew = true;
    }
  });
  
  if (hasNew) {
    
    list.forEach(function(equipment) {
      
      equipment.executeLinked(list, method);
    });
  }
};

Equipment.prototype.executeLinkedbyGrade = function(list, method, method2) {
  
  this.anchors.forEach(function(anchor) {
    
    if (anchor.linked.length != 0 && 
        list.indexOf(anchor.linked[0].equipment) === -1 && 
        anchor.linked[0].equipment.grade >= anchor.equipment.grade) {
      
      var largestGrade = anchor.linked[0].equipment.findLargestGrade();
      
      var linked = anchor.linked[0].equipment;
      
      if (largestGrade.grade >= anchor.equipment.grade) {
        
        method(anchor.linked[0].equipment);
      } else if (method2 !== undefined) {
        
        method2(anchor.linked[0].equipment, anchor.linked[0]);
      }
        
      list.push(linked);
      
      linked.executeLinkedbyGrade(list, method, method2);
    }
  });
};

Equipment.prototype.findLargestGrade = function() {
  
  var largest;
  
  this.anchors.forEach(function(anchor) {
  
    if (anchor.linked.length > 0) {
      
      if (largest === undefined || 
          largest.grade > anchor.linked[0].equipment.grade) {
        
        largest = anchor.linked[0].equipment;
      }
    }
  });
  
  return largest;
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

Equipment.prototype.translate = function (options) {
  
  if (options.x !== undefined && options.y !== undefined) {
    
    this.transform.translate({x: options.x, y: options.y});
    
    if (this.components)
      this.components.transform.translate({x: options.x, y: options.y});
    
  } else if (options.dx !== undefined && options.dy !== undefined) {
    
    var move = this.transform.translate({dx: options.dx, dy: options.dy});
    
    if (this.components)
      this.components.transform.translate({dx: move.dx, dy: move.dy});
  }
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

Equipment.prototype.save = function() {
  
  this.transform.transformDone();
  
  if (this.components)
    this.components.transform.transformDone();
};

