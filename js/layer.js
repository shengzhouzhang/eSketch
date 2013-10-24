function Layer() {
  
};


Layer.switchLayer = function(equipments, num) {
  
  var execute = function(show, hide) {
    
    equipments.forEach(function(equipment) {
      
      if (equipment.layer === num) {
        
        show(equipment);
      } else if (equipment.layer !== undefined) {
        
        hide(equipment);
      }
      
      equipment.lines.forEach(function(line) {
        
        if (line.layer === num)
          show(line);
        else
          hide(line);
      });
      
      equipment.anchors.forEach(function(anchor) {
        
        if (anchor.layer === num)
          show(anchor);
        else
          hide(anchor);
      });
      
      equipment.links.forEach(function(link) {
        
        if (link.layer === num)
          show(link);
        else if (link.layer !== undefined)
          hide(link);
      });
      
      equipment.slots.forEach(function(slot) {
        
        if (slot.layer === num)
          show(slot);
        else if (slot.layer !== undefined)
          hide(slot);
      });
      
    });
  };
  
  if (Equipment.ActivitedEquipment)
    Equipment.ActivitedEquipment.deactivate();
  
  switch (num) {
   
    case 1:
      
      Layer.hideScreen();
      
      execute(function(item) {
        
        switch (item.type) {
            
          case "equipment":
            item.fadeIn();
            break;
          case "line":
            item.fadeIn();
            break;
          case "link":
            item.show();
            break;
          case "slot":
            item.show();
            break;
          default:
            item.element.show();
            break;
        }
        
      }, function(item) {
        
        switch (item.type) {
          
          case "link":
            item.hide();
            break;
          case "slot":
            item.hide();
            break;
          default:
            item.element.hide();
            break;
        }
      });
      break;
    case 2:
      
      Layer.showScreen();
      
      execute(function(item) {
        
        switch (item.type) {
          
          case "link":
            item.show();
            break;
          case "slot":
            item.show();
            break;
          default:
            item.element.toFront().show();
            break;
        }
      }, function(item) {
        
        switch (item.type) {
          
          case "equipment":
            item.fadeOut();
            break;
          case "line":
            item.fadeOut();
            break;
          case "link":
            item.hide();
            break;
          case "slot":
            item.hide();
            break;
          default:
            item.element.hide();
            break;
        }
      });
      break; 
    default:
      break;
  }
};

Layer.showScreen = function() {
  
  if (Layer.screen === undefined || Layer.screen === null)
    Layer.screen = Panel.canvas.rect(0, 0, "100%", 680).attr({fill: "#fff", "fill-opacity": .0, stroke: "none"});
  else
    Layer.screen.toFront().show();
};

Layer.hideScreen = function() {
  
  if (Layer.screen !== undefined && Layer.screen !== null)
     Layer.screen.hide().toBack();
};
