function Background(canvas, options) {
  
  Background.canvas = canvas;
  this.url = options.url;
  
  this.components = [];
  
  var obj = this;
  
  this.background = Background.canvas.image(options.url, options.x, options.y, options.width, options.height);
  
  this.background.toBack();
  
  options.components.forEach(function(item) {
    
    obj.components.push(new Equipment(Background.canvas, item));
  });
  
};