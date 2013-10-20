function Mark() {
  
  var answer = Answer.output(Panel.equipments);
  
  console.log(JSON.stringify(answer));
  
  var mark_sheet = {"objects":[{"id":0,"type":"images/sample_6.png","transform":"t506.0312367101001,157.51098896188068s0.7,0.7,0,0"},{"id":1,"type":"images/sample_7.png","transform":"t442.5152218685437,251.37260749376998s0.7955,0.7955,0,0"},{"id":2,"type":"images/sample_1.png","transform":"t474.9375673163935,-30.039065965940864s0.7212,0.7212,0,0r33.942,0,0"},{"id":3,"type":"images/sample_2.png","transform":"t286.35581326834387,336.3578488199473s0.6521,0.6521,0,0r-57.241,0,0"},{"id":4,"type":"images/sample_5.png","transform":"t649.0163971993558,388.77249233089015s0.6203,0.6203,0,0r162.8758,0,0"},{"id":5,"type":"images/sample_3_1.png","transform":"t315.43242060140614,306.5941342307173s0.6648,0.6648,0,0r-60.361,0,0"},{"id":6,"type":"images/sample_3_1.png","transform":"t501.6384191511935,26.100367501548746s0.5392,0.5392,0,0r28.8535,0,0"},{"id":7,"type":"images/sample_3_1.png","transform":"t705.7521095861001,64.39131576638071s0.7,0.7,0,0r75.3572,0,0"},{"id":8,"type":"images/sample_4.png","transform":"t258.0830683541621,342.3698915293471s0.7,0.7,0,0r-48.9833,0,0"},{"id":9,"type":"images/sample_4.png","transform":"t522.5564162326435,427.61853821695075s0.7,0.7,0,0r216.7537,0,0"}],"relationships":[[{"equipment":0,"anchor":0,"type":"images/sample_6.png"},{"equipment":7,"anchor":0,"type":"images/sample_3_1.png"},{"angle":76}],[{"equipment":0,"anchor":1,"type":"images/sample_6.png"},{"equipment":2,"anchor":3,"type":"images/sample_1.png"},{"angle":98}],[{"equipment":0,"anchor":2,"type":"images/sample_6.png"},{"equipment":1,"anchor":0,"type":"images/sample_7.png"},{"angle":210}],[{"equipment":2,"anchor":0,"type":"images/sample_1.png"},{"equipment":3,"anchor":2,"type":"images/sample_2.png"},{"angle":-120}],[{"equipment":2,"anchor":2,"type":"images/sample_1.png"},{"equipment":6,"anchor":0,"type":"images/sample_3_1.png"},{"angle":-131}],[{"equipment":3,"anchor":0,"type":"images/sample_2.png"},{"equipment":4,"anchor":0,"type":"images/sample_5.png"},{"angle":198}],[{"equipment":3,"anchor":1,"type":"images/sample_2.png"},{"equipment":9,"anchor":0,"type":"images/sample_4.png"},{"angle":111}],[{"equipment":3,"anchor":4,"type":"images/sample_2.png"},{"equipment":5,"anchor":0,"type":"images/sample_3_1.png"},{"angle":-21}],[{"equipment":4,"anchor":1,"type":"images/sample_5.png"},{"equipment":8,"anchor":0,"type":"images/sample_4.png"},{"angle":-217}]]};
  

  // check relationship
  (function(criterion, answers) {
    
    var count = 0, count_angle = 0;
    var i, j;
    
    for (i = 0; i < criterion.length; i++) {
      
      for (j = 0; j < answers.length; j++) {
        
        if (((criterion[i][0].type === answers[j][0].type &&
              criterion[i][0].anchor === answers[j][0].anchor) &&
             (criterion[i][1].type === answers[j][1].type &&
              criterion[i][1].anchor === answers[j][1].anchor))) {
          
          count++;
          
          //console.log(answers[j][2].angle);
          if (Math.abs(criterion[i][2].angle - answers[j][2].angle) < 90)
            count_angle++;
          
          if (Math.abs(criterion[i][2].angle - answers[j][2].angle) !== 0) {
            
            //console.log(criterion[i][0].type + " " + criterion[i][1].type);
          }
            
          break;
        }
      };
    };
    
    console.log("join: " + count + " / " + criterion.length);
    console.log("angle: " + count_angle + " / " + count);
    
    //alert(count + " / " + criterion.length);
  })(mark_sheet.relationships, answer.relationships);
  
  
  var checkDistance = function(anchor_1, anchor_2) {
    
    var radius = 10;
    
    if (Math.abs(anchor_1.positionX() - anchor_2.positionX()) < radius &&
        Math.abs(anchor_1.positionY() - anchor_2.positionY()) < radius) {
      
      return true;
    }
    
    return false;
  };
  
  //check cylinder
  (function(equipments) {
    
    var linkedAnchor, linkedEquipment, isCorrect, count = 0;
  
    equipments.forEach(function(equipment) {
    
      if (equipment.url === "images/sample_3_1.png") {
       
        if (equipment.anchors[0].linked.length > 0) {
         
          linkedAnchor = equipment.anchors[0].linked[0];
          linkedEquipment = linkedAnchor.equipment;
          
          if (linkedEquipment.url === "images/sample_1.png" && 
              linkedAnchor.id == 2) {
            
            if (linkedEquipment.anchors[0].linked.length > 0) {
             
              linkedAnchor = linkedEquipment.anchors[0].linked[0];
              linkedEquipment = linkedAnchor.equipment;
              
              if (linkedEquipment.url === "images/sample_2.png" && 
                  linkedAnchor.id == 2) {
                
                isCorrect = checkDistance(
                  equipment.anchors[1],
                  linkedEquipment.anchors[3]);
                
                if (isCorrect)
                  count++;
              }
            }
          }
          
          if (linkedEquipment.url === "images/sample_2.png" && 
              linkedAnchor.id == 4) {
            
            if (linkedEquipment.anchors[1].linked.length > 0) {
             
              linkedAnchor = linkedEquipment.anchors[1].linked[0];
              linkedEquipment = linkedAnchor.equipment;
              
              if (linkedEquipment.url === "images/sample_4.png" && 
                  linkedAnchor.id == 1) {
                
                isCorrect = checkDistance(
                  equipment.anchors[1],
                  linkedEquipment.anchors[0]);
                
                if (isCorrect)
                  count++;
              }
            }
          }
          
          
          if (linkedEquipment.url === "images/sample_6.png" && 
              linkedAnchor.id == 0) {
            
            if (linkedEquipment.anchors[1].linked.length > 0) {
             
              linkedAnchor = linkedEquipment.anchors[1].linked[0];
              linkedEquipment = linkedAnchor.equipment;
              
              if (linkedEquipment.url === "images/sample_1.png" && 
                  linkedAnchor.id == 3) {
                
                isCorrect = checkDistance(
                  equipment.anchors[1],
                  linkedEquipment.anchors[1]);
                
                if (isCorrect)
                  count++;
              }
            }
          }
        }
      }
    });
    
    console.log("cylinders: " + count + " / 3");
    
  })(Panel.equipments);
  
  
  // check scale
  (function(criterion, answers) {
  
    var i, index, count = 0;
    var cX = 1, cY = 1;
    var aX = 1, aY = 1;
    var hB = .1, lB = -.05;
    
    for (i = 0; i < criterion.length; i++) {
      
      if ((index = criterion[i].transform.indexOf('s')) !== -1) {
        
        cX = criterion[i].transform.substring(
          index + 1,
          (index = criterion[i].transform.indexOf(',', index)));
        
        cY = criterion[i].transform.substring(
          index + 1,
          (index = criterion[i].transform.indexOf(',', index + 1)));
      }
      
      if (answers[i] && 
          (index = answers[i].transform.indexOf('s')) !== -1) {
        
        aX = answers[i].transform.substring(
          index + 1,
          (index = answers[i].transform.indexOf(',', index)));
        
        aY = answers[i].transform.substring(
          index + 1,
          (index = answers[i].transform.indexOf(',', index + 1)));
      }
      
      if (((aX - cX) > lB && (aX - cX) < hB) && 
          ((aY - cY) > lB && (aY - cY) < hB)) {
        
          count++;
      }
    }
    
    console.log("scale: " + count + " / " + criterion.length);
    
  })(mark_sheet.objects, answer.objects);
};

