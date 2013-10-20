function Answer() {
  
};


Answer.output = function(equipments) {
  
  var answer = {
    objects: [],
    relationships: []
  };
  
  var object;
  equipments.forEach(function(equipment) {
    
    if (equipment.type === "equipment") {
      
      object = {
        class: equipment.class,
        type: equipment.url,
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
    
    equipment.anchors.forEach(function(anchor) {
        
      anchor.linked.forEach(function(link) {
        
        for (i = 0; i < answer.relationships.length; i++) {
          
          var relationship = answer.relationships[i];
          
          if ((relationship[0].equipment === anchor.equipment.id &&relationship[0].anchor === anchor.id && relationship[1].equipment === link.equipment.id && relationship[1].anchor === link.id) || (relationship[1].equipment === anchor.equipment.id && relationship[1].anchor === anchor.id && relationship[0].equipment === link.equipment.id && relationship[0].anchor === link.id))
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
      
        answer.relationships.push([
          {equipment: anchor.equipment.id, anchor: anchor.id, type: anchor.equipment.url},
          {equipment: link.equipment.id, anchor: link.id, type: link.equipment.url},
          {angle: Math.round(angle)}
        ]);
      });
    });
  });
  
  return answer;
};