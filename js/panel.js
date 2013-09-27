function Panel(canvas) {
  
  Panel.canvas = canvas;
  
  this.buttons = [];
};

Panel.equipments = [];
Panel.classes = [];

Panel.prototype.register = function(equipment) {
  
  equipment.id = Panel.equipments.length;
  
  Panel.equipments.push(equipment);
  
  equipment.updatePanel = this.update;
  
  
  if (equipment.url && Panel.classes.indexOf(equipment.url) === -1) {
    
    if (equipment.youtube !== undefined || equipment.wikipedia !== undefined) {
      
      $("<tr>").html("<td class='image'><img src='" + equipment.url + "' /></td><td class='link'>" + (equipment.youtube === undefined ? "" : "<a href='" + equipment.youtube + "' target='_blank'>YouTube</a>") + "</td><td class='link'>" + (equipment.wikipedia === undefined ? "" : "<a href='" + equipment.wikipedia + "' target='_blank'>Wikipedia</a>") + "</td>").appendTo($("table.info"));
    }
    
    Panel.classes.push(equipment.url);
  }
}

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
    path: "M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.982,21.375h-1.969v-1.889h1.969V21.375zM16.982,17.469v0.625h-1.969v-0.769c0-2.321,2.641-2.689,2.641-4.337c0-0.752-0.672-1.329-1.553-1.329c-0.912,0-1.713,0.672-1.713,0.672l-1.12-1.393c0,0,1.104-1.153,3.009-1.153c1.81,0,3.49,1.121,3.49,3.009C19.768,15.437,16.982,15.741,16.982,17.469z",
    attrs: {"fill": "#000", stroke: "none"},
    text: "References"
  }
];

Panel.prototype.drawButtons = function() {
  
  var size = 25;
  var marginX = 10;
  var marginY = 10;
  var positionX = marginX + size;
  var positionY = -size;
  
  var i;
  
  for (i = 0; i < Panel.buttons.length; i++) {
    
    positionY += marginX + size * 2;
    
    var button = Panel.canvas.set();
    var json = Panel.buttons[i];
    
    button.push(
      Panel.canvas.path(json.path).attr(json.attrs).transform("t" + (positionX - 16) + "," + (positionY - 16) + "s1.2"),
      Panel.canvas.circle(positionX, positionY, size).attr({stroke: "#aaa", fill: "#eee", "fill-opacity": .4, "stroke-width": 1, cursor: "pointer"}),
      Panel.canvas.text(positionX + size + 10, positionY, json.text).attr({"text-anchor": "start", "font-size": 16, "font-family": "ubuntu"}));
    
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
    
    Answer.output(Panel.equipments);
  });
  
  var showInfo = false;
  
  this.buttons[3].click(function() {
    
    if (showInfo) {
      
      $("table.info").fadeOut("fast");
      
      showInfo = false;
    } else {
      
      $("table.info").fadeIn("fast");
      
      showInfo = true;
    }
  });
};

Panel.prototype.showButtons = function() {
  
  this.buttons.forEach(function(button) {
  
    button.toFront();
  });
}
