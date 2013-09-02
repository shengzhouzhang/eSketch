function Magnet (canves, options) {
  
  Magnet.canves = canves;
  
  this.element = Magnet.canves.circle(options.x, options.y, Magnet.Radius).attr({"stroke-dasharray": "--", opacity: 0.5});
  this.anchor = options.anchor;
};

Magnet.Radius = 30;

Magnet.prototype.pull = function(anchor_1, anchor_2) {
  
  
  if (Math.abs(anchor_1.positionX() - anchor_2.positionX()) < Magnet.Radius && Math.abs(anchor_1.positionY() - anchor_2.positionY()) < Magnet.Radius) {
    
    var move = anchor_1.equipment.freeTransform.translate({
      x: anchor_2.positionX() + anchor_1.distanceX(), 
      y: anchor_2.positionY() + anchor_1.distanceY()
    });
    
    anchor_1.equipment.executeLinked([anchor_1.equipment], function(item) {
    
      item.freeTransform.translate({
        dx: move.dx, 
        dy: move.dy
      });
    });
    
    return true;
  }
  
  return false;
}

Magnet.prototype.remove = function() {
  
  this.element.remove();
}