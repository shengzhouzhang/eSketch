function Equipment(canvas, options) {
  
  // Inherit from Element
  Element.call(this);
  
  Equipment.canvas = canvas;
  this.type = "equipment";
  this.name = options.name;
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
  this.lines = [];
  this.component;
  this.status = Equipment.StatusList.Normal;
  
  this.render(options);

  this.save();
};

Equipment.prototype = new Element();
Equipment.prototype.constructor = Equipment;

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
    
    if (equipment.removed != true)
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
Equipment.prototype.render = function(options) {
  
  var equipment = this;
  
  this.draw(options);
  
  this.transform = this.applyTransform();
  this.transform.drawHandles();
  this.transform.hideHandles();
  
  if (options.components)
    this.drawComponent(options.components);
  
  // click event mouse down
  this.element.mousedown(function() {
    
    if (Equipment.ActivitedEquipment)
      Equipment.ActivitedEquipment.deactivate();
    
    equipment.activite();
  });
  
  this.scale({x: 0.7, y: 0.7});
  
  this.show(Panel.layer);
};
// draw equipment, anchors, and slots
Equipment.prototype.draw = function(options) {
  
  var equipment = this;
  
  var set = Equipment.canvas.set();
    
  this.element = Equipment.canvas.image(this.url, this.x, this.y, this.width, this.length);
  
  set.push(this.element);
  
  if (options.lines) {
    
    options.lines.forEach(function(line) {
    
      var line = new Line(Equipment.canvas, line, equipment);
      
      equipment.lines.push(line);
      set.push(line.element);
    });
  }
  
  // draw anchors
  if (options.anchors) {
    
    options.anchors.forEach(function(anchor) {
      
      var anchor = new Anchor(Equipment.canvas, anchor, equipment);
      
      anchor.id = equipment.anchors.length;
 
      equipment.anchors.push(anchor);
      set.push(anchor.element);
    });
  }
  
  // draw links
  if (options.links) {
    
    options.links.forEach(function(link) {
      
      var link = new Link(Equipment.canvas, link, equipment);
      
      link.id = equipment.links.length;
      link.element.dragable = false;
      equipment.links.push(link);
      set.push(link.element);
    });
  }
  
  // draw slots
  if (options.slots) {
    
    options.slots.forEach(function(slot) {
      
      var slot = new Slot(Equipment.canvas, slot, equipment);
      
      slot.id = equipment.slots.length;
      
      equipment.slots.push(slot);
      set.push(slot.element);
      
      if (slot.textElement)
        set.push(slot.textElement);
      
    });
  }
  
  
    
  this.set = set;
};

Equipment.prototype.drawComponent = function(components) {
  
  var equipment = this;
  
  components.forEach(function(component) {
    equipment.component = new Component(Equipment.canvas, component, equipment);
  });
  
  // make main element at front
  this.set.toFront();
};


Equipment.prototype.applyTransform = function() {
  
  var equipment = this;
  
  var transform = new Transform(Equipment.canvas, {set: this.set}, function(transform, event) {
    
    //console.log(event.name);
    switch (event.name) {

      case "drag start":
        break;
      case "drag":
        
        Anchor.ActiviteMagnet("drag");
        
        // update components
        if (equipment.component)
          equipment.component.translate({dx: event.dx, dy: event.dy});
        
        
        equipment.executeLinked([equipment], function(equipment, link) {
          
          if (link.linked.length > 0) {

            link.linked[0].equipment.translate({
              x: link.positionX() + link.linked[0].distanceX(), 
              y: link.positionY() + link.linked[0].distanceY()
            });
          }
        });
        
        break;
      case "drag end":
        
        equipment.save();
        
        equipment.executeLinked([equipment], function(equipment) {
          
          equipment.save();
          
          equipment.updateCenter();
        });
        
        Anchor.UnactiviteMagnet("drag");
        
        break;
      case "rotate start":
        
        break;
      case "rotate":
        
        Anchor.ActiviteMagnet("rotate");
        
        if (equipment.component) {
          
          equipment.component.rotate({
            degree: event.degree,
            x: event.centerX, 
            y: event.centerY
          });
        }
        
        equipment.executeLinkedbyGrade([equipment], function(equipment) {
          
          equipment.rotate({
            degree: event.degree,
            x: event.centerX, 
            y: event.centerY
          });
          
        }, function(equipment, anchor) {
        
          Anchor.Break(anchor);
        });
        
        equipment.links.forEach(function(link) {
        
          link.updateHooked();
        });
        
        break;
      case "rotate end":
        
        equipment.save();
        
        equipment.executeLinkedbyGrade([equipment], function(equipment) {
          
          equipment.save();
          
          equipment.updateCenter();
        });
        
        Anchor.UnactiviteMagnet("rotate");
        
        break;
      case "scale start":

        break;
      case "scale":
        
        if (equipment.component) {
          
          equipment.component.scale({
            x: event.scale.x, 
            y: event.scale.y
          });
        }
        
        // update linked equipment's position
        equipment.executeLinked([equipment], function(equipment, link) {
            
          if (link.linked.length > 0) {
            
            link.linked[0].equipment.translate({
              x: link.positionX() + link.linked[0].distanceX(), 
              y: link.positionY() + link.linked[0].distanceY()
            });
          }
        });
        
        break;
      case "scale end":
        
        equipment.save();
        
        equipment.executeLinked([equipment], function(equipment) {
          
          equipment.save();
          
          equipment.updateCenter();
        });
        
        break;
      default:
        break;
    }
    
    equipment.checkHiddenPoint();
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
  var equipment = this;
  var center;
  
  // find the rotate center
  equipment.anchors.forEach(function(anchor) {
    
    if (anchor.linked.length !== 0 && anchor.linked[0].equipment.grade <= equipment.grade) {
      
      if (max === -1 || 
          anchor.linked[0].equipment.grade < max) {
        
        max = anchor.linked[0].equipment.grade; 
        center = anchor.linked[0];
      }
    }
  });
          
  if (center !== undefined && 
      ((equipment.center === undefined || equipment.center === null) || equipment.grade > center.equipment.grade))
    equipment.center = center;
  
  if (equipment.center !== undefined && equipment.center !== null)
    equipment.transform.moveCenter({
      x: equipment.center.positionX(),
      y: equipment.center.positionY()
    });
};

Equipment.prototype.translate = function (options) {
  
  var move;
  
  if (options.x !== undefined && options.y !== undefined) {
    
    move = this.transform.translate({x: options.x, y: options.y});
    
    if (this.component) {
      this.component.translate({x: options.x, y: options.y});
    }
    
  } else if (options.dx !== undefined && options.dy !== undefined) {
    
    move = this.transform.translate({dx: options.dx, dy: options.dy});
    
    if (this.component) {
      this.component.translate({dx: move.dx, dy: move.dy});
    }
  }
  
  return move;
};

Equipment.prototype.rotate = function (options) {
  
  this.transform.rotate({
    degree: options.degree, 
    center: {
      x: options.x, 
      y: options.y
    }
  });
  
  if (this.component) {
    this.component.rotate({
      degree: options.degree,
      x: options.x, 
      y: options.y
    });
  }
};

Equipment.prototype.scale = function (options) {
  
  this.transform.scale({
    x: options.x,
    y: options.y
  });
  
  if (this.component) {
    
    this.component.scale({
      x: options.x,
      y: options.y
    });
  }
};

Equipment.prototype.show = function(layer) {
  
  if (this.layer != layer)
    this.element.hide();
  else
    this.element.show();
  
  //console.log(this.lines);
  this.lines.forEach(function(line) {
    
    if (line.layer != layer)
      line.hide();
    else
      line.show();
  });
  
  this.anchors.forEach(function(anchor) {
    
    if (anchor.layer != layer)
      anchor.hide();
    else
      anchor.show();
  });
  
  this.slots.forEach(function(slot) {
    
    if (slot.layer != layer)
      slot.hide();
    else
      slot.show();
  });
  
  this.links.forEach(function(link) {
    
    if (link.layer != layer)
      link.hide();
    else
      link.show();
  });
  
  if (this.component)
      this.component.show(layer);
};

Equipment.prototype.fadeOut = function() {
  
  this.disable = true;
  
  this.element.attr({opacity: .5});
  
  if (this.component)
    this.component.fadeOut();
};

Equipment.prototype.fadeIn = function() {
  
  this.disable = true;
  
  this.element.attr({opacity: 1});
  
  if (this.component)
    this.component.fadeIn();
};

Equipment.prototype.transformString = function() {
  
  if (this.transform.history)
    return this.transform.history.toTransformString();
  else
    return ""; 
};


Equipment.prototype.checkHiddenPoint = function() {
  
  var equipment = this;
  
  var point_x_1, point_y_1, point_x_2, point_y_2, radius = 5;
  
  var show = false;
  
  var hiddenPoints = [], show = [false, false, false];
  
  Panel.equipments.forEach(function(equipment) {
    
    if (equipment.url === "images/sample_3_1.png" && equipment.removed != true) {
      
      hiddenPoints.push(equipment.anchors[1]);
    }
  });
  
  Panel.equipments.forEach(function(equipment) {
    
    if (equipment.removed != true)
      equipment.anchors.forEach(function(anchor) {
        
        var i;
        
        for (i = 0; i < hiddenPoints.length; i++) {
          
          point_x_1 = hiddenPoints[i].positionX();
          point_y_1 = hiddenPoints[i].positionY();
          
          if (anchor.status === Anchor.StatusList.Normal && anchor !== hiddenPoints[i]) {
            
            // check distance
            point_x_2 = anchor.positionX();
            point_y_2 = anchor.positionY();
            
            if (Math.abs(point_x_1 - point_x_2) < radius && 
                Math.abs(point_y_1 - point_y_2) < radius) {
              
              show[i] = true;
            }
          }
        };
      });
  });
  
  for (i = 0; i < hiddenPoints.length; i++) {
    
    if (show[i])
      hiddenPoints[i].show();
    else
      hiddenPoints[i].hide();
  }
};

Equipment.prototype.save = function() {
  
  this.transform.transformDone();
  
  if (this.component)
    this.component.transform.transformDone();
};

