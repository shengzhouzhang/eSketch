function Anchor(canvas, options) {
  
  Anchor.canvas = canvas;
  this.type = "anchor";
  this.id = null;
  this.layer = options.layer;
  this.x = options.x;
  this.y = options.y;
  this.opacity = options.opacity || 1;
  this.radius = options.radius || 4;
  this.equipment = options.equipment;
  this.linked = [];
  
  var obj = this;
  
  this.element = Anchor.canvas.circle(this.x, this.y, this.radius);
  
  this.element.attr({opacity: this.opacity});
  
  this.normalize();
  
  this.element.click(function(){
  
    if (obj.status === Anchor.StatusList.Normal)
      obj.activite();
    else if (obj.status === Anchor.StatusList.Pinned)
      obj.unpin();
  });
};

/*
 * ***********************
 * Anchor's attributes
 * ***********************
 */

Anchor.ActivitiedAnchors = [];
Anchor.Magnet = null;
Anchor.StatusList = {Normal: "red", Focused: "green", Activited: "yellow",Pinned: "orange"};

Anchor.Join = function(anchor_1, anchor_2) {
  
  anchor_1.pin(anchor_2);
  anchor_2.pin(anchor_1);
};

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

Anchor.prototype.distanceX = function() {
  
  return (this.equipment.transform.center.objectX() - this.positionX());
};

Anchor.prototype.distanceY = function() {
  
  return (this.equipment.transform.center.objectY() - this.positionY());
};

Anchor.ActiviteMagnet = function() {
  
  if (Anchor.ActivitiedAnchors.length === 2 && (Anchor.ActivitiedAnchors[0].equipment.status === Equipment.StatusList.Activited || Anchor.ActivitiedAnchors[1].equipment.status === Equipment.StatusList.Activited) && Anchor.Magnet === null) {
    
    if (Anchor.ActivitiedAnchors[0].equipment.status !== Equipment.StatusList.Activited) {
      
    Anchor.Magnet = new Magnet(Anchor.canvas, {x: Anchor.ActivitiedAnchors[0].positionX(), y: Anchor.ActivitiedAnchors[0].positionY(), anchor: Anchor.ActivitiedAnchors[0]});
    
    } else if (Anchor.ActivitiedAnchors[1].equipment.status !== Equipment.StatusList.Activited) {
      
      Anchor.Magnet = new Magnet(Anchor.canvas, {x: Anchor.ActivitiedAnchors[1].positionX(), y: Anchor.ActivitiedAnchors[1].positionY(), anchor: Anchor.ActivitiedAnchors[1]});
      
    }
  }
};

Anchor.UnactiviteMagnet = function() {
  
  if (Anchor.ActivitiedAnchors.length === 2 && Anchor.Magnet !== null) {
    
    if (Anchor.ActivitiedAnchors[0].equipment.status === Equipment.StatusList.Activited && Anchor.ActivitiedAnchors[1].equipment.status === Equipment.StatusList.Normal) {
      

      if (Anchor.Magnet.pull(Anchor.ActivitiedAnchors[0], Anchor.ActivitiedAnchors[1])) {
      
        Anchor.Join(Anchor.ActivitiedAnchors[0], Anchor.ActivitiedAnchors[1]);
        
        Anchor.ActivitiedAnchors.splice(0, 2);
        Anchor.ActivitiedAnchors.length = 0;
      }
      
    } else if (Anchor.ActivitiedAnchors[0].equipment.status === Equipment.StatusList.Normal && Anchor.ActivitiedAnchors[1].equipment.status === Equipment.StatusList.Activited) {
      
      if (Anchor.Magnet.pull(Anchor.ActivitiedAnchors[1], Anchor.ActivitiedAnchors[0])) {
      
        Anchor.Join(Anchor.ActivitiedAnchors[0], Anchor.ActivitiedAnchors[1]);
        
        Anchor.ActivitiedAnchors.splice(0, 2);
        Anchor.ActivitiedAnchors.length = 0;
      }
    }
  }
  
  if (Anchor.Magnet !== null) {
    
    Anchor.Magnet.remove();
    delete Anchor.Magnet;
    Anchor.Magnet = null;
  }
};


