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
      
      var offset = equipment_1.translate({
        x: anchor_2.positionX() + anchor_1.distanceX(), 
        y: anchor_2.positionY() + anchor_1.distanceY()
      });
      
      console.log(offset);
      
      equipment_1.executeLinked([anchor_1.equipment], function(item) {
        
        
        item.translate({
          dx: offset.dx, 
          dy: offset.dy
        });
        
        /*
        item.translate({
          x: anchor_2.positionX() + anchor_1.distanceX(), 
          y: anchor_2.positionY() + anchor_1.distanceY()
        });
        */
      });
      break;
    case "rotate":
      break;
        default:
      break;
  }
  
  equipment_1.save();
  equipment_2.save();
};

Magnet.prototype.remove = function() {
  
  this.element.remove();
};