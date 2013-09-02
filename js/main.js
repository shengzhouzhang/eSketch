
$(document).ready(function() {

  var canves = Raphael("canves");
  var panel = new Panel(canves);
  
  panel.createButtons();
  
  equipmentsData.forEach(function(equipment){
  
    //equipments.push(new Equipment(canves, panel, equipment));
    
    panel.register(new Equipment(canves, equipment));
  });
  
});