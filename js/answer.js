function Answer() {
  
};


Answer.output = function(equipments) {
  
  var answer = {
    objects: [],
    relationships: []
  };
  
  var object;
  equipments.forEach(function(equipment) {
    
    if (equipment.type === "equipment" && equipment.removed != true) {
      
      object = {
        name: equipment.name,
        transform: equipment.transformString()
      };
      
      if (equipment.component)
        object.component = equipment.component.element.matrix.toTransformString();
      
      answer.objects.push(object);
  }
  });
  
  var i, angle;
  var point_1_x, point_1_y, point_2_x, point_2_y, point_3_x, point_3_y;
  
  equipments.forEach(function(equipment) {
    
    if (equipments.removed != true)
      equipment.anchors.forEach(function(anchor) {
        
        anchor.linked.forEach(function(link) {
          
          for (i = 0; i < answer.relationships.length; i++) {
            
            var relationship = answer.relationships[i];
            
            if ((relationship[0].id === anchor.equipment.id && relationship[0].anchor === anchor.id && 
                 relationship[1].id === link.equipment.id && relationship[1].anchor === link.id) || 
                (relationship[1].id === anchor.equipment.id && relationship[1].anchor === anchor.id && 
                 relationship[0].id === link.equipment.id && relationship[0].anchor === link.id))
              return;
          }
          
          point_1_x = anchor.positionX();
          point_1_y = anchor.positionY();
          point_2_x = anchor.equipment.transform.center.objectX();
          point_2_y = anchor.equipment.transform.center.objectY();
          point_3_x = link.equipment.transform.center.objectX();
          point_3_y = link.equipment.transform.center.objectY();
          
          angle = Raphael.angle(point_2_x, point_2_y, 
                                point_3_x, point_3_y,
                                point_1_x, point_1_y);
          
          var scale_1 = Answer.getScale(anchor.equipment.transformString());
          var scale_2 = Answer.getScale(link.equipment.transformString());
          
          answer.relationships.push([
            {name: anchor.equipment.name, id: anchor.equipment.id, anchor: anchor.id},
            {name: link.equipment.name, id: link.equipment.id, anchor: link.id},
            {angle: Math.round(angle), scaleX: (scale_1.x / scale_2.x).toFixed(2), scaleY: (scale_1.y / scale_2.y).toFixed(2)}
          ]);
        });
      });
  });
  
  return answer;
};

Answer.getScale = function(transform) {
  
  var scaleX, scaleY;
  
  if ((index = transform.indexOf('s')) !== -1) {
    
    scaleX = transform.substring(
      index + 1,
      (index = transform.indexOf(',', index)));
    
    scaleY = transform.substring(
      index + 1,
      (index = transform.indexOf(',', index + 1)));
  }
  
  return {x: scaleX, y: scaleY};
};