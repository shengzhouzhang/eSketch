
$(document).ready(function() {

  var canvas = Raphael("canvas");
  var panel = new Panel(canvas);
  
  panel.drawButtons();
  
  var otherLayer = [];
  
  equipmentsData.forEach(function(item) {
    
    if (item.layer == 1)
      panel.register(item);
    else
      otherLayer.push(item);
  });
  
  var background = new Background(canvas, {url: "images/background.png", x: 0, y: 370, width: "110%", height: 310, components: [{layer: 1, url: "images/truck.png", x:150, y: 150, width: 200, length: 100}]});
  
  //var loader = new Loader(panel);
  
  //$("table.info").hide();
  $("table.info").draggable();
  
  
});