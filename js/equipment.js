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

Equipment.prototype.applyTransform = function() {
  
  var obj = this;
  
  var transform = new Transform(Equipment.canvas, this.set, function(transform, event) {
    
    switch (event.name) {

      case "drag start":
        break;
      case "drag":
        
        Anchor.ActiviteMagnet();
        
        obj.links.forEach(function(link) {
          
          link.updateHooked();
        });
        
        obj.executeLinked([obj], function(item) {
          
          item.transform.translate({dx: event.dx, dy: event.dy});
          
          item.links.forEach(function(link) {
            
            link.updateHooked();
          });
        });
        
        
        
        break;
      case "drag end":
        
      
        obj.executeLinked([obj], function(item) {
        
          item.transform.translateDone();
          
          item.updateCenter();
        });
        
        break;
      case "rotate start":
        
        break;
      case "rotate":
        
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
        
        obj.executeLinkedbyGrade([obj], function(item) {
          
          item.transform.rotateDone();
          
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
        
        obj.executeLinked([obj], function(item) {
        
          item.transform.translateDone();
          
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
};

Equipment.prototype.fadeOut = function() {
  
  this.disable = true;
  
  this.element.attr({opacity: .5});
};

Equipment.prototype.fadeIn = function() {
  
  this.disable = true;
  
  this.element.attr({opacity: 1});
};

Equipment.prototype.transformString = function() {
  
  if (this.transform.history)
    return this.transform.history.toTransformString();
  else
    return ""; 
};

