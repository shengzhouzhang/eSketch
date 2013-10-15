function Mark() {
  
  var answer = Answer.output(Panel.equipments);
  
  console.log(JSON.stringify(answer));
  
  var mark_sheet = {"objects":[{"id":0,"type":"images/sample_1.png","transform":"t373.8502850689705,96.84398966455396s0.8,0.8,0,0r51.0757,0,0"},{"id":1,"type":"images/sample_2.png","transform":"t-322.29405289791754,415.24271314112593s0.777,0.777,0,0r-65.4764,0,0"},{"id":2,"type":"images/sample_3_1.png","transform":"t-51.784037544473534,430.8610015454219s0.8,0.8,0,0r-66.0078,0,0","components":"t-51.784037544473534,430.8610015454219s0.8,0.8,0,0r-66.0078,0,0"},{"id":3,"type":"images/sample_3_1.png","transform":"t185.53404631697046,85.45636723415397s0.8,0.8,0,0r44.8718,0,0","components":"t185.53404631697046,85.45636723415397s0.8,0.8,0,0r44.8718,0,0"},{"id":4,"type":"images/sample_3_1.png","transform":"t404.50233057937044,253.689246678154s0.8,0.8,0,0r86.1563,0,0","components":"t404.50233057937044,253.689246678154s0.8,0.8,0,0r86.1563,0,0"},{"id":5,"type":"images/sample_4.png","transform":"t-35.688357068123494,22.691510197831832s0.8,0.8,0,0r34.4486,0,0"},{"id":6,"type":"images/sample_4.png","transform":"t413.62159796714855,175.36537415702188s0.8,0.8,0,0r105.8989,0,0"},{"id":7,"type":"images/sample_5.png","transform":"t380.3635521485145,726.3243540841711s0.6956,0.6956,0,0r140.4916,0,0"},{"id":8,"type":"images/sample_6.png","transform":"t41.97818010737048,2.498295778153988s0.8,0.8,0,0"},{"id":9,"type":"images/sample_7.png","transform":"t191.57818010737049,56.89829577815391s0.8,0.8,0,0"},{"id":10,"type":"images/sample_8.png","transform":"t27,26s0.8,0.8,0,0"},{"id":11,"type":"images/sample_9.png","transform":"t75,26s0.8,0.8,0,0"}],"relationships":[[{"equipment":0,"anchor":0,"type":"images/sample_1.png"},{"equipment":1,"anchor":2,"type":"images/sample_2.png"},{"angle":-95}],[{"equipment":0,"anchor":2,"type":"images/sample_1.png"},{"equipment":3,"anchor":0,"type":"images/sample_3_1.png"},{"angle":-130}],[{"equipment":0,"anchor":3,"type":"images/sample_1.png"},{"equipment":8,"anchor":1,"type":"images/sample_6.png"},{"angle":-84}],[{"equipment":1,"anchor":0,"type":"images/sample_2.png"},{"equipment":7,"anchor":0,"type":"images/sample_5.png"},{"angle":212}],[{"equipment":1,"anchor":1,"type":"images/sample_2.png"},{"equipment":5,"anchor":1,"type":"images/sample_4.png"},{"angle":106}],[{"equipment":1,"anchor":4,"type":"images/sample_2.png"},{"equipment":2,"anchor":0,"type":"images/sample_3_1.png"},{"angle":-24}],[{"equipment":4,"anchor":0,"type":"images/sample_3_1.png"},{"equipment":8,"anchor":0,"type":"images/sample_6.png"},{"angle":-66}],[{"equipment":6,"anchor":1,"type":"images/sample_4.png"},{"equipment":7,"anchor":1,"type":"images/sample_5.png"},{"angle":213}],[{"equipment":8,"anchor":2,"type":"images/sample_6.png"},{"equipment":9,"anchor":0,"type":"images/sample_7.png"},{"angle":211}]]};
  

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
            
            console.log(criterion[i][0].type + " " + criterion[i][1].type);
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
      
      if ((index = answers[i].transform.indexOf('s')) !== -1) {
        
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

