
$(document).ready(function() {

  var canvas = Raphael("canvas");
  var panel = new Panel(canvas);
  
  /*
  console.log(Raphael.angle(
    10, 
    0,
    0,
    10,
    0,
    0
   ));
  */
  
  panel.drawButtons();
  
  equipmentsData.forEach(function(item) {
    
    switch(item.type) {
     
      case "equipment":
        panel.register(new Equipment(canvas, item));
        break;
      case "pipe":
        panel.register(new Pipe(canvas, item));
        break;
      default:
        break;
    }
  });
  
  Layer.switchLayer(Panel.equipments, 1);
  
 //var background = new Background(canvas, {url: "images/background.png", x: 0, y: 370, width: "110%", height: 310, components: [{layer: 1, url: "images/truck.png", x:150, y: 150, width: 200, length: 100}]});
  
  var loader = new Loader();
  
  $("table.info").hide();
  $("table.info").draggable();
  
  
});