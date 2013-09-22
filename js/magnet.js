function Magnet (canvas, options) {
  
  Magnet.canvas = canvas;
  
  this.element = Magnet.canvas.circle(options.x, options.y, Magnet.Radius).attr({"stroke-dasharray": "--", opacity: 0.5});
  this.anchor = options.anchor;
};

Magnet.Radius = 30;

Magnet.pull = function(anchor_1, anchor_2) {
    
  var move = anchor_1.equipment.transform.translate({
    x: anchor_2.positionX() + anchor_1.distanceX(), 
    y: anchor_2.positionY() + anchor_1.distanceY()
  });
  
  if (anchor_1.equipment.components)
    anchor_1.equipment.components.transform.translate({
      dx: move.dx, 
      dy: move.dy
    });
};


Magnet.prototype.pull = function(anchor_1, anchor_2) {
    
  var move = anchor_1.equipment.transform.translate({
    x: anchor_2.positionX() + anchor_1.distanceX(), 
    y: anchor_2.positionY() + anchor_1.distanceY()
  });
  
  if (anchor_1.equipment.components)
    anchor_1.equipment.components.transform.translate({dx: move.dx, 
                                                       dy: move.dy});
  
  anchor_1.equipment.executeLinked([anchor_1.equipment], function(item) {
    
    item.transform.translate({
      dx: move.dx, 
      dy: move.dy
    });
    
    if (item.components)
      item.components.transform.translate({
        dx: move.dx, 
        dy: move.dy
      });
  });
};

Magnet.prototype.rotatePull = function(anchor_1, anchor_2) {
  
  var c1, c2;
  var r1, r2;
  
  anchor_1.equipment.anchors.forEach(function(anchor) {
  
    if (anchor.link[0].length > 0)
      c1 = anchor.link[0];
  });
  
  if (c1 !== undefined) {
   
    r1 = Math.sqrt(Math.paw(c1.positionX() - anchor_1.positionX(), 2) + Math.paw(c1.positionY() - anchor_1.positionY(), 2));
  }
  
  anchor_2.equipment.anchors.forEach(function(anchor) {
  
    if (anchor.link[0].length > 0)
      c2 = anchor.link[0];
  });
  
  if (c2 !== undefined) {
   
    r2 = Math.sqrt(Math.paw(c2.positionX() - anchor_2.positionX(), 2) + Math.paw(c2.positionY() - anchor_2.positionY(), 2));
  }
  
  
  
  anchor_1.equipment.executeLinkedbyGrade([anchor_1.equipment], function(item) {
    
    item.rotate({
      degree: event.degree,
      x: event.centerX, 
      y: event.centerY
    });
  });
};

Magnet.prototype.remove = function() {
  
  this.element.remove();
};