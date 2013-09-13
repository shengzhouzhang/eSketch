function Window (canvas, options) {
  
  Window.canvas = canvas;
  this.type = "window";
  this.x = options.x;
  this.y = options.y;
  this.width = options.width;
  this.height = options.height;
  this.radius = options.radius;
  this.color = options.color;
  this.origin = options.origin;
  this.originLines = [];
  
  this.element = Window.canvas.rect(this.x, this.y, this.width, this.height, this.radius).attr({"stroke-dasharray": "--", fill: this.color, "fill-opacity": .5});
  
  var ox;
  var oy;
  
  var obj = this;
  var bbox = this.element.getBBox();
  
  this.element.drag(function(dx, dy, x, y) {
    
    obj.element.attr({x: ox + dx, y: oy + dy});
    
    for (var i = 0; i < obj.content.length; i++) {
      
      var equipment = obj.content[i];
      
      equipment.transform.translate({x: ox + dx + equipment.width / 2 + 50, y: oy + dy + equipment.length / 2 + 20 + 110 * i});
      
      equipment.links.forEach(function(link) {
        
        link.updateHooked();
      });
      
    };
    
    obj.updateEX();
  
  }, function(x, y) {
  
    ox = obj.element.attr("x");
    oy = obj.element.attr("y");
    
  }, function() {
  
  });
  
  this.content = [];
  
  this.register();
  
  this.show();
};

Window.prototype.register = function() {
  
  var obj = this;
  
  Panel.equipments.forEach(function(equipment) {
    
    if (equipment.window === 1)
      obj.content.push(equipment);
  });
  
  var bbox = this.element.getBBox();
  
  for (var i = 0; i < this.content.length; i++) {
  
    var equipment = this.content[i];
    
    equipment.transform.translate({x: bbox.x + equipment.width / 2 + 50, y: bbox.y + equipment.length / 2 + 20 + 110 * i});
    
    equipment.element.unmousedown();
    equipment.element.unmouseup();
  };
}

Window.prototype.show = function() {
  
  
  this.showEX();
  
  this.element.toFront().show();
  
  this.content.forEach(function(equipment) {
          
    equipment.fadeIn();
    equipment.element.toFront().show();
    
    equipment.links.forEach(function(link) {
      
      link.show();
    });
  })
};

Window.prototype.hide = function() {
  
  this.element.hide();
  
  this.hideEX();
  
  this.content.forEach(function(equipment) {
    
    equipment.element.hide();
    
    equipment.links.forEach(function(link) {
      
      link.hide();
    });
  });
};

Window.prototype.showEX = function() {
  
  if (this.originLines.length === 0) {
    
    var bbox = this.element.getBBox();
    var obbox = this.origin.element.getBBox();
    var opacity = .5;
    
    this.originLines.push(Window.canvas.path().attr({"stroke-dasharray": "--", opacity: opacity, stroke: "#aaa"}));
    
    this.originLines[this.originLines.length - 1].attr({
      path: [
        ["M", bbox.x, bbox.y],
        ["L", obbox.x, obbox.y]
      ]
    });
    
    this.originLines.push(Window.canvas.path().attr({"stroke-dasharray": "--", opacity: opacity, stroke: "#aaa"}));
    
    this.originLines[this.originLines.length - 1].attr({
      path: [
        ["M", bbox.x2, bbox.y],
        ["L", obbox.x2, obbox.y]
      ]
    });
    
    this.originLines.push(Window.canvas.path().attr({"stroke-dasharray": "--", opacity: opacity, stroke: "#aaa"}));
    
    this.originLines[this.originLines.length - 1].attr({
      path: [
        ["M", bbox.x2, bbox.y2],
        ["L", obbox.x2, obbox.y2]
      ]
    });
    
    this.originLines.push(Window.canvas.path().attr({"stroke-dasharray": "--", opacity: opacity, stroke: "#aaa"}));
    
    this.originLines[this.originLines.length - 1].attr({
      path: [
        ["M", bbox.x, bbox.y2],
        ["L", obbox.x, obbox.y2]
      ]
    });
  } else {
    
    this.updateEX();
    
    this.originLines.forEach(function(line) {
      
      line.show();
    });
  }
};

Window.prototype.updateEX = function() {
  
  var bbox = this.element.getBBox();
  var obbox = this.origin.element.getBBox();
  
  if (this.originLines.length === 4) {
    
    this.originLines[0].attr({
      path: [
        ["M", bbox.x, bbox.y],
        ["L", obbox.x, obbox.y]
      ]
    });
    
    this.originLines[1].attr({
      path: [
        ["M", bbox.x2, bbox.y],
        ["L", obbox.x2, obbox.y]
      ]
    });
    
    this.originLines[2].attr({
      path: [
        ["M", bbox.x2, bbox.y2],
        ["L", obbox.x2, obbox.y2]
      ]
    });
    
    this.originLines[3].attr({
      path: [
        ["M", bbox.x, bbox.y2],
        ["L", obbox.x, obbox.y2]
      ]
    });
  }
};

Window.prototype.hideEX = function() {
  
  this.originLines.forEach(function(line) {
  
    line.hide();
  });
};