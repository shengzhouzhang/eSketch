function Slot(canvas, options, equipment) {
  
  Element.call(this);
  
  Slot.canvas = canvas;
  this.type = "slot";
  this.id = null;
  this.layer = options.layer;
  this.x = options.x;
  this.y = options.y;
  this.width = options.width;
  this.height = options.height;
  this.text = options.text;
  this.opacity = options.opacity || 1;
  this.equipment = equipment;
  
  this.element = Slot.canvas.rect(this.x, this.y, this.width, this.height, 3).attr({"stroke-dasharray": "--", fill: "white", "fill-opacity": 0.3}).hide();
  
  if (this.text != undefined) {
    
    this.textElement = Slot.canvas.text(this.x + this.width / 2, this.y + this.height / 2, this.text).attr({fill: "white", "font-size": 24, "font-weight": "bold"});
  }
  
  this.isShowing = false;
  
  var obj = this;
  
  this.element.click(function(eve) {
  
    if (obj.isShowing === false) {
      
      var bbox = obj.element.getBBox();
      var width = 400;
      var height = 250;
      var x = (bbox.x + bbox.x2 - width) / 2;
      var y = (bbox.y + bbox.y2 - height) / 2;
      
      
      if (obj.window) {
        obj.window.show();
      } else {
        
        obj.window = new Window(Slot.canvas, {x: x, y: y, width: width, height: height, radius: 5, color: "white", origin: obj});
        
        
      }
      
      obj.isShowing = true;
      
      
    } else {
     
      obj.window.hide(); 
      
      obj.isShowing = false;
    }
    
  });
};

Slot.prototype = new Element();
Slot.prototype.constructor = Slot;

Slot.prototype.show = function() {
  
  this.textElement.toFront().show();
  this.element.toFront().show();
  
  if (this.window && this.isShowing === true)
    this.window.show();
};

Slot.prototype.hide = function() {
  
  this.element.hide();
  this.textElement.hide();
  
  if (this.window)
    this.window.hide();
};