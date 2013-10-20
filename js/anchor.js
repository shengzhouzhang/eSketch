function Anchor(canvas, options, equipment) {
  
  Element.call(this);
  
  Anchor.canvas = canvas;
  this.type = "anchor";
  this.id = null;
  this.layer = options.layer;
  this.x = options.x;
  this.y = options.y;
  this.opacity = options.opacity || 1;
  this.radius = options.radius || 4;
  this.equipment = equipment;
  this.linked = [];
  this.hidden = options.hidden;
  var obj = this;
  
  this.element = Anchor.canvas.circle(this.x, this.y, this.radius);
  
  if (this.hidden)
    this.element.hide();
  
  this.element.attr({opacity: this.opacity});
  
  this.normalize();
  
  if (options.color) {

    this.element.attr({fill: options.color});
    
  } else {
  
    this.element.click(function() {
      
      if (obj.status === Anchor.StatusList.Normal)
        obj.activite();
      else if (obj.status === Anchor.StatusList.Pinned)
        obj.unpin();
    });
  }
};

Anchor.prototype = new Element();
Anchor.prototype.constructor = Anchor;

/*
* ***********************
* Anchor's attributes
* ***********************
*/

Anchor.ActivitiedAnchors = [];
Anchor.Magnet = null;
Anchor.StatusList = {Normal: "red", Focused: "green", Activited: "yellow", Pinned: "orange"};

Anchor.Join = function(anchor_1, anchor_2) {
  
  anchor_1.pin(anchor_2);
  anchor_2.pin(anchor_1);
};

Anchor.Break = function(anchor_1) {
  
  anchor_1.normalize();
  
  anchor_1.linked.forEach(function(link) {
  
    link.normalize();
    link.linked.splice(0, link.linked.length);
    link.linked.length = 0;
  });
  
  anchor_1.linked.splice(0, anchor_1.linked.length);
  anchor_1.linked.length = 0;
}

Anchor.clearActivited = function() {
  
  Anchor.ActivitiedAnchors.splice(0, Anchor.ActivitiedAnchors.length);
  Anchor.ActivitiedAnchors.length = 0;
};

Anchor.createMagnet = function(options) {
  
  if (Anchor.Magnet === null) {
    Anchor.Magnet = new Magnet(Anchor.canvas, {
      x: options.x,
      y: options.y, 
      anchor: options.anchor
    });
  }
};

Anchor.removeMagnet = function() {
  
  if (Anchor.Magnet !== null) {
    
    Anchor.Magnet.remove();
    delete Anchor.Magnet;
    Anchor.Magnet = null;
  }
};

Anchor.hasMagnet = function() {
  
  if (Anchor.Magnet === null)
    return false;
  else
    return true;
}
/*
* ***********************
* Anchor's methods
* ***********************
*/

Anchor.prototype.normalize = function() {
  
  if (Anchor.ActivitiedAnchors.length >= 2 && Anchor.ActivitiedAnchors[1] === this) {
    
    Anchor.ActivitiedAnchors.splice(1, 1);
  }
  
  if (Anchor.ActivitiedAnchors.length >= 1 && Anchor.ActivitiedAnchors[0] === this) {
    
    Anchor.ActivitiedAnchors.splice(0, 1);
  }
  
  this.element.attr({fill: Anchor.StatusList.Normal});
  this.status = Anchor.StatusList.Normal;
};

Anchor.prototype.focus = function() {
  
  this.element.attr({fill: Anchor.StatusList.Focused});
  this.status = Anchor.StatusList.Focused;
};

Anchor.prototype.activite = function() {
  
  if (Anchor.ActivitiedAnchors.length === 0) {
    
    Anchor.ActivitiedAnchors.push(this);
    
    this.element.attr({fill: Anchor.StatusList.Activited});
    this.status = Anchor.StatusList.Activited;
    
  } else if (Anchor.ActivitiedAnchors.length === 1) {
    
    if (Anchor.ActivitiedAnchors[0].equipment === this.equipment) {
      
      Anchor.ActivitiedAnchors[0].normalize();
    }
    
    Anchor.ActivitiedAnchors.push(this);
    
    this.element.attr({fill: Anchor.StatusList.Activited});
    this.status = Anchor.StatusList.Activited;
    
  } else if (Anchor.ActivitiedAnchors.length >= 2) {
    
    if (Anchor.ActivitiedAnchors[1].equipment === this.equipment) {
      
      Anchor.ActivitiedAnchors[1].normalize();
      
    } else {
      
      Anchor.ActivitiedAnchors[0].normalize();
    }
    
    Anchor.ActivitiedAnchors.push(this);
    
    this.element.attr({fill: Anchor.StatusList.Activited});
    this.status = Anchor.StatusList.Activited;
  }
};

Anchor.prototype.pin = function(anchor) {
  
  this.element.attr({fill: Anchor.StatusList.Pinned});
  this.status = Anchor.StatusList.Pinned;
  
  this.linked.push(anchor);
  
  this.equipment.updateCenter();
};

Anchor.prototype.unpin = function() {
  
  this.linked.forEach(function(anchor){
    
    anchor.normalize();
    anchor.linked.splice(0, anchor.linked.length);
    
    var hasPinned = false;
    
    anchor.equipment.anchors.forEach(function(item){
      
      if (item.status === Anchor.StatusList.Pinned)
        hasPinned = true;
    });
  });
  
  this.normalize();
  this.linked.splice(0, this.linked.length);
  
  var hasPinned = false;
  
  this.equipment.anchors.forEach(function(anchor){
    
    if (anchor.status === Anchor.StatusList.Pinned)
      hasPinned = true;
  });
};

Anchor.prototype.positionX = function() {
  
  return this.element.matrix.x(this.element.attrs.cx, this.element.attrs.cy);
};

Anchor.prototype.positionY = function() {
  
  return this.element.matrix.y(this.element.attrs.cx, this.element.attrs.cy);
};

/*
 * distance from center point
 */
Anchor.prototype.distanceX = function() {
  
  return (this.equipment.transform.center.objectX() - this.positionX());
};

Anchor.prototype.distanceY = function() {
  
  return (this.equipment.transform.center.objectY() - this.positionY());
};

Anchor.ActiviteMagnet = function(option) {
  
  if (Anchor.ActivitiedAnchors.length === 2) {
    
    var anchor_1 = Anchor.ActivitiedAnchors[0];
    var anchor_2 = Anchor.ActivitiedAnchors[1];
    var equipment_1 = anchor_1.equipment;
    var equipment_2 = anchor_2.equipment;
    var isLinked = Equipment.isLinked(equipment_1, equipment_2);
    
    if ((option === "drag" && !isLinked) || 
        (option === "rotate" && isLinked)) {
      
      
      if ((equipment_1.status === Equipment.StatusList.Activited ||
           equipment_2.status === Equipment.StatusList.Activited) &&
          Anchor.Magnet === null) {
        
        var unactivited;
        
        if (equipment_1.status === Equipment.StatusList.Activited) {
          
          unactivited = anchor_2;
          
        } else {
          
          unactivited = anchor_1;
        }
        
        Anchor.createMagnet({
          x: unactivited.positionX(),
          y: unactivited.positionY(), 
          anchor: unactivited
        });
      }
    }
  }
};

Anchor.UnactiviteMagnet = function(option) {
  
  if (Anchor.ActivitiedAnchors.length === 2 && Anchor.hasMagnet()) {
    
    var anchor_1 = Anchor.ActivitiedAnchors[0];
    var anchor_2 = Anchor.ActivitiedAnchors[1];
    var equipment_1 = anchor_1.equipment;
    var equipment_2 = anchor_2.equipment;
    var activited;
    var unactivited;
    
    if (equipment_1.status === Equipment.StatusList.Activited && 
        equipment_2.status === Equipment.StatusList.Normal) {
      
      activited = anchor_1;
      unactivited = anchor_2;
      
    } else {
      
      activited = anchor_2;
      unactivited = anchor_1;
    }
    
    if (Math.abs(anchor_1.positionX() - anchor_2.positionX()) < Magnet.Radius &&
        Math.abs(anchor_1.positionY() - anchor_2.positionY()) < Magnet.Radius) {
      
      Anchor.Magnet.pull(activited, unactivited, option);
      
      Anchor.Join(anchor_1, anchor_2);
      
      Anchor.clearActivited();
    }
    
    Anchor.removeMagnet();
  }
};


