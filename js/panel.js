function Panel(canvas) {
  
  var panel = this;
  
  Panel.canvas = canvas;
  
  this.buttons = [];
  
  $( "table.info" ).on( "click", "tr", function(event, event2) {

    event.preventDefault();
    
    var index = $(this).attr("id");

    panel.createEquipment(index);
  });
};

Panel.layer = 1;
Panel.equipments = [];
Panel.classes = [];
Panel.equipmentTypes = [];
Panel.equipment2 = [];

Panel.prototype.register = function(equipment) {
  
  var panel = this;

  if (equipment.name && 
      Panel.equipmentTypes.indexOf(equipment.name) === -1) {
    
   
   this.position(equipment);
    
    if (equipment.layer == 1) {
      
      $("<tr>").html("<td class='image'><img src='" + equipment.url + "' /></td><td>" + equipment.name + "</td>").attr("id", Panel.equipmentTypes.length).appendTo($("table.info"));
      
      Panel.classes.push(equipment.name);
      Panel.equipmentTypes.push(equipment);
    } else {
      
      Panel.equipments.push(new Equipment(Panel.canvas, equipment, {}));
    }
  }
};

Panel.prototype.position = function(equipment) {
  
  equipment.x = 200;
  equipment.y = 100;
  
  if (equipment.anchors)
    equipment.anchors.forEach(function(anchor) {
      
      anchor.x += equipment.x;
      anchor.y += equipment.y;
    });
  
  if (equipment.links)
    equipment.links.forEach(function(link) {
      
      link.x += equipment.x;
      link.y += equipment.y;
    });
  
  if (equipment.slots)
    equipment.slots.forEach(function(slot) {
      
      slot.x += equipment.x;
      slot.y += equipment.y;
    });
  
  if (equipment.components)
    equipment.components.forEach(function(component) {
      
      component.x += equipment.x;
      component.y += equipment.y;
      
      component.anchors.forEach(function(anchor) {
        
        anchor.x += component.x;
        anchor.y += component.y;
      });
    });
};
  
Panel.prototype.createEquipment = function(index) {
  
  var item = Panel.equipmentTypes[index];
  
  var equipment = new Equipment(Panel.canvas, item, {});
      
  equipment.id = Panel.equipments.length;
  //equipment.class = index;
  
  //equipment.class = Panel.classes.length;
  
  Panel.equipments.push(equipment);
};

Panel.prototype.createEquipmentbyName = function(name) {
  
  var result = $.grep(Panel.equipmentTypes, function(type) {
  
    return type.name == name;
  });
  
  if (result.length > 0) {
    
    var equipment = new Equipment(Panel.canvas, result[0], {});
    equipment.id = Panel.equipments.length;
    Panel.equipments.push(equipment);
  }
};

Panel.prototype.update = function(options) {
  
  var item = $("ul.attributes > li:eq(" + options.id + ")");
    
  item.find("span.rotate").html(options.rotate);
  item.find("span.scaleX").html(options.scale.x);
  item.find("span.scaleY").html(options.scale.y);
};

Panel.buttons = [
  {
    path: "M16,30.534c8.027,0,14.534-6.507,14.534-14.534c0-8.027-6.507-14.534-14.534-14.534C7.973,1.466,1.466,7.973,1.466,16C1.466,24.027,7.973,30.534,16,30.534zM18.335,6.276l3.536,3.538l-6.187,6.187l6.187,6.187l-3.536,3.537l-9.723-9.724L18.335,6.276z",
    attrs: {"fill": "#000", stroke: "#fff", "stroke-width": 2},
    text: "Mechanical"
  },
  {
    path: "M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466zM13.665,25.725l-3.536-3.539l6.187-6.187l-6.187-6.187l3.536-3.536l9.724,9.723L13.665,25.725z",
    attrs: {"fill": "#000", stroke: "#fff", "stroke-width": 2},
    text: "Energy"
  },
  {
    path: "M2.379,14.729 5.208,11.899 12.958,19.648 25.877,6.733 28.707,9.561 12.958,25.308z",
    attrs: {"fill": "#000", stroke: "black", "stroke-width": 2},
    text: "Submit"
  },
  {
    path: "M23.963,20.834L17.5,9.64c-0.825-1.429-2.175-1.429-3,0L8.037,20.834c-0.825,1.429-0.15,2.598,1.5,2.598h12.926C24.113,23.432,24.788,22.263,23.963,20.834z",
    attrs: {"fill": "#000", stroke: "none"},
    text: "To Front"
  },
  {
    path: "M8.037,11.166L14.5,22.359c0.825,1.43,2.175,1.43,3,0l6.463-11.194c0.826-1.429,0.15-2.598-1.5-2.598H9.537C7.886,8.568,7.211,9.737,8.037,11.166z",
    attrs: {"fill": "#000", stroke: "none"},
    text: "To Back"
  },
  {
    path: "M20.826,5.75l0.396,1.188c1.54,0.575,2.589,1.44,2.589,2.626c0,2.405-4.308,3.498-8.312,3.498c-4.003,0-8.311-1.093-8.311-3.498c0-1.272,1.21-2.174,2.938-2.746l0.388-1.165c-2.443,0.648-4.327,1.876-4.327,3.91v2.264c0,1.224,0.685,2.155,1.759,2.845l0.396,9.265c0,1.381,3.274,2.5,7.312,2.5c4.038,0,7.313-1.119,7.313-2.5l0.405-9.493c0.885-0.664,1.438-1.521,1.438-2.617V9.562C24.812,7.625,23.101,6.42,20.826,5.75zM11.093,24.127c-0.476-0.286-1.022-0.846-1.166-1.237c-1.007-2.76-0.73-4.921-0.529-7.509c0.747,0.28,1.58,0.491,2.45,0.642c-0.216,2.658-0.43,4.923,0.003,7.828C11.916,24.278,11.567,24.411,11.093,24.127zM17.219,24.329c-0.019,0.445-0.691,0.856-1.517,0.856c-0.828,0-1.498-0.413-1.517-0.858c-0.126-2.996-0.032-5.322,0.068-8.039c0.418,0.022,0.835,0.037,1.246,0.037c0.543,0,1.097-0.02,1.651-0.059C17.251,18.994,17.346,21.325,17.219,24.329zM21.476,22.892c-0.143,0.392-0.69,0.95-1.165,1.235c-0.474,0.284-0.817,0.151-0.754-0.276c0.437-2.93,0.214-5.209-0.005-7.897c0.881-0.174,1.708-0.417,2.44-0.731C22.194,17.883,22.503,20.076,21.476,22.892zM11.338,9.512c0.525,0.173,1.092-0.109,1.268-0.633h-0.002l0.771-2.316h4.56l0.771,2.316c0.14,0.419,0.53,0.685,0.949,0.685c0.104,0,0.211-0.017,0.316-0.052c0.524-0.175,0.808-0.742,0.633-1.265l-1.002-3.001c-0.136-0.407-0.518-0.683-0.945-0.683h-6.002c-0.428,0-0.812,0.275-0.948,0.683l-1,2.999C10.532,8.77,10.815,9.337,11.338,9.512z",
    attrs: {"fill": "#000", stroke: "none"},
    text: "Recycle"
  },
  {
    path: "M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.982,21.375h-1.969v-1.889h1.969V21.375zM16.982,17.469v0.625h-1.969v-0.769c0-2.321,2.641-2.689,2.641-4.337c0-0.752-0.672-1.329-1.553-1.329c-0.912,0-1.713,0.672-1.713,0.672l-1.12-1.393c0,0,1.104-1.153,3.009-1.153c1.81,0,3.49,1.121,3.49,3.009C19.768,15.437,16.982,15.741,16.982,17.469z",
    attrs: {"fill": "#000", stroke: "none"},
    text: "Guide"
  }
];

Panel.prototype.drawButtons = function() {
  
  var size = 25;
  var marginX = 10;
  var marginY = 10;
  //var positionX = marginX + size;
  //var positionY = -size;
  var positionX = -size;
  var positionY = marginY + size;
  
  var i;
  
  for (i = 0; i < Panel.buttons.length; i++) {
    
    //positionY += marginX + size * 2;
  positionX += marginX + size * 2;
    
    var button = Panel.canvas.set();
    var json = Panel.buttons[i];
    
    button.push(
      Panel.canvas.path(json.path).attr(json.attrs).transform("t" + (positionX - 16) + "," + (positionY - 16) + "s1.2"),
      Panel.canvas.circle(positionX, positionY, size).attr({stroke: "#aaa", fill: "#eee", "fill-opacity": .4, "stroke-width": 1, cursor: "pointer"})
      //Panel.canvas.text(positionX - size / 2, positionY + size + 10, json.text).rotate(60).attr({"text-anchor": "start", "font-size": 16, "font-family": "ubuntu"})
    );
    
    this.buttons.push(button);
  }
  
  var panel = this;
  
  this.buttons[0].click(function() {

    Layer.switchLayer(Panel.equipments, 1);
     panel.showButtons();
  });
  
  this.buttons[1].click(function() {

    Layer.switchLayer(Panel.equipments, 2);
    panel.showButtons();
  });
  
  this.buttons[2].click(function() {
    
    var mark = new Mark();
    
    $('#markModal').modal('toggle');
  });
  
  this.buttons[3].click(function() {
    
    if (Equipment.ActivitedEquipment)
      Equipment.ActivitedEquipment.set.toFront();
  });
  
  this.buttons[4].click(function() {
    
    if (Equipment.ActivitedEquipment)
      Equipment.ActivitedEquipment.set.toBack();
  });
  
  this.buttons[5].click(function() {
    
    if (Equipment.ActivitedEquipment) {
      
      Equipment.ActivitedEquipment.anchors.forEach(function(anchor) {
        
        Anchor.Break(anchor);
      });
      
      var equipment = Equipment.ActivitedEquipment;
      equipment.deactivate();
      equipment.set.remove();
      equipment.removed = true;
    }
  });
  
  this.buttons[6].click(function() {
    
    var references = window.open("./pages/excavator.html");
    
    references.onload = function() {
      
      var button = references.document.getElementById("start_quiz");
      
      button.className = button.className + " disabled";
    }
  });
};

Panel.prototype.showButtons = function() {
  
  this.buttons.forEach(function(button) {
  
    button.toFront();
  });
}
