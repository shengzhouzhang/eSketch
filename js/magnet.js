function Magnet (canvas, options) {
  
  Magnet.canvas = canvas;
  
  this.element = Magnet.canvas.circle(options.x, options.y, Magnet.Radius).attr({"stroke-dasharray": "--", opacity: 0.5});
  this.anchor = options.anchor;
};

Magnet.Radius = 20;

Magnet.prototype.pull = function(anchor_1, anchor_2, option) {
  
  var equipment_1 = anchor_1.equipment;
  var equipment_2 = anchor_2.equipment;
  
  switch (option) {
      
    case "drag":
      
      var move = equipment_1.transform.translate({
        x: anchor_2.positionX() + anchor_1.distanceX(), 
        y: anchor_2.positionY() + anchor_1.distanceY()
      });
      
      if (equipment_1.components)
        equipment_1.components.transform.translate({dx: move.dx, 
                                                           dy: move.dy});
      
      equipment_1.executeLinked([anchor_1.equipment], function(item) {
        
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
      break;
    case "rotate":
      
      var degree = Raphael.angle(
        anchor_2.positionX(),
        anchor_2.positionY(),
        anchor_1.positionX(), 
        anchor_1.positionY(),
        equipment_1.center.positionX(),
        equipment_1.center.positionY()
      );
      
      equipment_1.transform.rotate({
        degree: degree,
        center: {
          x: equipment_1.center.positionX(),
          y: equipment_1.center.positionY(),
        }
      });
      
      if (equipment_1.components) {
        
        equipment_1.components.transform.rotate({
          degree: degree,
          center: {
            x: equipment_1.center.positionX(),
            y: equipment_1.center.positionY(),
          }
        });
      }
      break;
        default:
      break;
  }
  
  equipment_1.save();
  equipment_2.save();
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