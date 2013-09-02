function Panel(canves) {
  
  Panel.canves = canves;
  this.number_of_items = 0;
  this.number_of_buttons = 0;
  
  this.equipments = [];
  
  this.layer2 = [];
  
  this.buttons = [];
};

Panel.prototype.register = function(equipment) {
  
  equipment.id = this.number_of_items++;
  
  $("li.info").before($("<li>").html("<span class='scaleX'></span><span class='scaleY'></span><span class='rotate'></span>").addClass("number"));
  
  this.equipments.push(equipment);
  
  if (equipment.layer === 2) {
   
   this.layer2.push(equipment); 
  }
  
  equipment.updatePanel = this.update;
}

Panel.prototype.update = function(options) {
  
  var item = $("ul.attributes > li:eq(" + options.id + ")");
    
  item.find("span.rotate").html(options.rotate);
  item.find("span.scaleX").html(options.scale.x);
  item.find("span.scaleY").html(options.scale.y);
};

Panel.prototype.fadeIn = function() {
  
  if (this.layer !== undefined && this.layer !== null)
      this.layer.toBack();
  
  this.equipments.forEach(function(equipment) {
  
    equipment.anchors.forEach(function(anchor) {
    
      anchor.element.show();
    });
    
    equipment.slots.forEach(function(slot) {
      
      slot.hide();
    }); 
  });
  
  this.layer2.forEach(function(equipment) {
  
    equipment.element.hide();
  });
};

Panel.prototype.fadeOut = function() {
  
  if (Equipment.ActivitedEquipment !== null)
    Equipment.ActivitedEquipment.deactivate(false);
  
  this.showLayerTwo();
  
  this.equipments.forEach(function(equipment) {
  
    equipment.anchors.forEach(function(anchor) {
    
      anchor.element.hide();
    });
    
     
    equipment.slots.forEach(function(slot) {
      
      slot.toFront().show();
    }); 
  });
  
  this.buttons.forEach(function(button) {
    
    button.forEach(function(element) {
      element.toFront();
    })
  });
  
  this.layer2.forEach(function(equipment) {
  
    equipment.element.toFront().show();
    
    equipment.anchors.forEach(function(anchor) {
    
      anchor.toFront();
    });
    
    equipment.slots.forEach(function(slot) {
      
      console.log(slot);
      slot.toFront().show();
    });
  });
};

Panel.prototype.createButtons = function() {
  
  var size = 25;
  var marginX = 10;
  var marginY = 10;
  var positionX = marginX + size;
  var positionY = 0;
  
  positionY += marginX + size * ++this.number_of_buttons;
  
  var button = Panel.canves.set();
  
  button.push(Panel.canves.path("M16,30.534c8.027,0,14.534-6.507,14.534-14.534c0-8.027-6.507-14.534-14.534-14.534C7.973,1.466,1.466,7.973,1.466,16C1.466,24.027,7.973,30.534,16,30.534zM18.335,6.276l3.536,3.538l-6.187,6.187l6.187,6.187l-3.536,3.537l-9.723-9.724L18.335,6.276z").attr({"fill": "#000", stroke: "#fff", "stroke-width": 2}).transform("t" + (positionX - 16) + "," + (positionY - 16) + "s1.2"), Panel.canves.circle(positionX, positionY, size).attr({stroke: "#aaa", fill: "#eee", "fill-opacity": .4, "stroke-width": 2, cursor: "pointer"}));
  

  button[1].hover(function() {
  
    button[1].attr({"stroke": "#999", "fill-opacity": 0});
  }, function() {
  
    button[1].attr({"stroke": "#ccc", "fill-opacity": .4});
  });
  
  this.buttons.push(button);
  
  positionY += marginX + size * ++this.number_of_buttons;
  
  var button2 = Panel.canves.set();
  
  
  button2.push(Panel.canves.path("M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466zM13.665,25.725l-3.536-3.539l6.187-6.187l-6.187-6.187l3.536-3.536l9.724,9.723L13.665,25.725z").attr({"fill": "#000", stroke: "#fff", "stroke-width": 2}).transform("t" + (positionX - 16) + "," + (positionY - 16) + "s1.2"), Panel.canves.circle(positionX, positionY, size).attr({stroke: "#ccc", fill: "#fff", "fill-opacity": .4, "stroke-width": 2, cursor: "pointer"}));
  
  button2[1].hover(function() {
    
    button2[1].attr({"stroke": "#999", "fill-opacity": 0});
  }, function() {
    
    button2[1].attr({"stroke": "#ccc", "fill-opacity": .4});
  });
  
  this.buttons.push(button2);
  
  var panel = this;
  
  button.click(function() {

    panel.fadeIn();
  });
  
  button2.click(function() {

    panel.fadeOut();
  });
};

Panel.prototype.showLayerTwo = function() {
  
  if (this.layer === undefined || this.layer === null)
    this.layer = Panel.canves.rect(0, 0, "100%", 680).attr({fill: "while", "fill-opacity": .2});
  else
    this.layer.toFront();
};
