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
        id: equipment.id,
        transform: equipment.transformString()
      };
      
      if (equipment.components)
        object.components = equipment.components.set[0].matrix.toTransformString();
      
      answer.objects.push(object);
  }
  });
  
  var i;
  
  equipments.forEach(function(equipment) {
    
    equipment.anchors.forEach(function(anchor) {
        
      anchor.linked.forEach(function(link) {
        
        for (i = 0; i < answer.relationships.length; i++) {
          
          var relationship = answer.relationships[i];
          
          if ((relationship[0].equipment === anchor.equipment.id &&relationship[0].anchor === anchor.id && relationship[1].equipment === link.equipment.id && relationship[1].anchor === link.id) || (relationship[1].equipment === anchor.equipment.id && relationship[1].anchor === anchor.id && relationship[0].equipment === link.equipment.id && relationship[0].anchor === link.id))
            return;
        }
      
        answer.relationships.push([
          {equipment: anchor.equipment.id, anchor: anchor.id},
          {equipment: link.equipment.id, anchor: link.id}
        ]);
      });
    });
  });
  
  console.log(JSON.stringify(answer));
  
  return JSON.stringify(answer);
};