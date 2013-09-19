
$(document).ready(function() {

  var canvas = Raphael("canvas");
  var panel = new Panel(canvas);
  
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
  
  //var loader = new Loader();
  
  $("table.info").hide();
  $("table.info").draggable();
});