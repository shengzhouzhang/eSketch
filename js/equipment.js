function Equipment(canves, options) {
  
  this.canves = canves;
  this.url = options.url;
  this.x = options.x;
  this.y = options.y;
  this.width = options.width;
  this.length = options.length;
  this.anchors = [];
  this.slots = [];
  this.linked = [];
  this.status = Equipment.StatusList.Normal;
  this.type = options.type;
  this.grade = options.grade;
  this.layer = options.layer || 1;
  var obj = this;
  
  this.raphaelSet = canves.set();
  
  this.element = this.canves.image(this.url, this.x, this.y, this.width, this.length);
  
  if(this.layer === 2)
    this.element.hide();
  
  this.raphaelSet.push(this.element);
  
  // create anchors
  options.anchors.forEach(function(anchor) {
    
    if (anchor.type !== "slot") {
      
      var anchor = new Anchor(canves, {x: anchor.x + obj.x, y: anchor.y + obj.y, radius: anchor.radius, opacity: anchor.opacity, equipment: obj});
      
      obj.anchors.push(anchor);
      obj.raphaelSet.push(anchor.element);
    } else {
      
    }
  });
  
  if (options.slots)
    options.slots.forEach(function(slot) {
      
      var slot = obj.canves.rect(obj.x + slot.x, obj.y + slot.y, slot.width, slot.height, 3).attr({stroke: "#aaa", fill: "#ccc"}).hide();
      
      obj.slots.push(slot);
      obj.raphaelSet.push(slot);
    });
  
  var ftOptions = {draw: ["bbox"], scale: ["bboxCorners", "bboxSides"], rotate: ["axisX"], drag: ["center", "self"], keepRatio: ["bboxCorners"]};
  
  
  this.freeTransform = new Transform(canves, this.raphaelSet, function(transform, event) {
    
    switch (event.name) {

      case "drag start":
        break;
      case "drag":
        
        Anchor.ActiviteMagnet();
        
        obj.executeLinked([obj], function(item) {
        
          item.freeTransform.translate({dx: event.dx, dy: event.dy});
        });
        
        break;
      case "drag end":
      
        obj.executeLinked([obj], function(item) {
        
          item.freeTransform.translateDone();
          
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
        
        break;
      case "rotate end":
        
        obj.executeLinkedbyGrade([obj], function(item) {
          
          item.freeTransform.rotateDone();
          
          item.updateCenter();
        });
        
        break;
      case "scale start":
        
        //var odx = obj.freeTransform
        break;
      case "scale":
        
        obj.executeLinked([obj], function(item) {
        
          //item.freeTransform.translate({dx: event.dx, dy: event.dy});
        });
        
        break;
      case "scale end":
        
        break;
      default:
        break;
    }
  });
  
  this.freeTransform.drawHandles(this.raphaelSet);
  
  this.freeTransform.equipment = this;
  
  this.freeTransform.hideHandles({undrag: false});
  
  // click event mouse down
  this.element.mousedown(function() {
      
      if (Equipment.ActivitedEquipment !== null && Equipment.ActivitedEquipment !== obj)
        Equipment.ActivitedEquipment.deactivate(false);
      
    obj.activite();
    
    Equipment.ActivitedEquipment.freeTransform.showHandles();
    
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

Equipment.StatusList = {Normal: "nromal", Activited: "activited", Grouped: "grouped"};

Equipment.ActivitedEquipment = null;

/*
 * ***********************
 * Equipment's methods
 * ***********************
 */

// active an equipment to transform
Equipment.prototype.activite = function() {
  
  if (this.status !== Equipment.StatusList.Activited) {
    
    this.status = Equipment.StatusList.Activited;
    
    //this.element.toFront();
    
    this.anchors.forEach(function(anchor) {
    
      //anchor.element.toFront();
    });
    
    Equipment.ActivitedEquipment = this;
  }
};

// deactive an equipment
Equipment.prototype.deactivate = function(undrag) {
  
  if (this.status !== Equipment.StatusList.Normal) {
    
    this.status = Equipment.StatusList.Normal;
    this.freeTransform.hideHandles({undrag: undrag});
    Equipment.ActivitedEquipment = null;
  }
};

// group two equipment
Equipment.prototype.group = function() {
  
  if (this.status !== Equipment.StatusList.Grouped) {
    
    this.status = Equipment.StatusList.Grouped;
  }
};

// degroup equipments
Equipment.prototype.ungroup = function() {
  

};

// degroup equipments
Equipment.prototype.hasPinned = function() {
  
  var hasPinned = [];
  
  this.anchors.forEach(function(anchor) {
  
    if (anchor.status === Anchor.StatusList.Pinned)
      hasPinned.push(anchor);
  });
  
  return hasPinned;
};

Equipment.prototype.updatePositions = function(list) {
  
  this.anchors.forEach(function(anchor) {
    
    if (anchor.linked.length != 0 && list.indexOf(anchor.linked[0].equipment) === -1) {
      
      //method(anchor.linked[0].equipment);
      
      anchor.linked[0].equipment.freeTransform.translate({
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
    obj.freeTransform.moveCenter({
      x: obj.center.positionX(),
      y: obj.center.positionY()
    });
};

Equipment.prototype.rotate = function (options) {
  
  this.freeTransform.rotate({
    degree: options.degree, 
    center: {
      x: options.x, 
      y: options.y
    }
  });
};

Equipment.prototype.fade = function() {
  
  this.disable = true;
  
  this.element.attr({opacity: .7});
  
  this.anchors.forEach(function(anchor) {
  
    anchor.element.attr({opacity: .3});
  });
};

