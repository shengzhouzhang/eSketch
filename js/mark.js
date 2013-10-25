function Mark() {
  
  var answer = Answer.output(Panel.equipments);
  
  console.log(JSON.stringify(answer));
  
  var mark_sheet = {
    "objects": [
      {"name":"Upper-Carriage","transform":"t638.9999662007735,172.500007011489s0.7,0.7,0,0"},
      {"name":"Lower-Carriage","transform":"t575.6849662007735,266.420207011489s0.7949,0.7949,0,0"},
      {"name":"Boom","transform":"t781.5103279399735,-80.72306752721099s0.7,0.7,0,0r60.252,0,0"},
      {"name":"Stick","transform":"t447.0443027697736,-6.596676646010977s0.7,0.7,0,0"},
      {"name":"Bucket","transform":"t401.0696883766463,232.05205213547163s0.6306,0.6306,0,0r-77.5336,0,0"}
    ],
    "relationships": [
      [{"name":"Upper-Carriage","anchor":1},{"name":"Boom","anchor":3},
       {"angle": {"max": 170, "min": 70}, "scaleX":"1.00","scaleY":"1.00"}],
      [{"name":"Upper-Carriage","anchor":2},{"name":"Lower-Carriage","anchor":0},
       {"angle": {"max": 215, "min": 205}, "scaleX":"0.88","scaleY":"0.88"}],
      [{"name":"Boom", "anchor":0},{"name":"Stick","anchor":2},
       {"angle": {"max": 300, "min": 160}, "scaleX":"1.00","scaleY":"1.00"}],
      [{"name":"Stick","anchor":0},{"name":"Bucket","anchor":0},
       {"angle": {"max": 265, "min": 65}, "scaleX":"1.11","scaleY":"1.11"}]
    ]
  };
  

  // check relationship
  (function(criterion, answers) {
    
    var count = 0, count_angle = 0, correct_join, correct_angle, correct_scale;
    var i, j;
    
    $("table.mark tbody").html("");
    
    for (i = 0; i < criterion.length; i++) {
      
      correct_join = correct_angle = correct_scale = false; 
      
      for (j = 0; j < answers.length; j++) {
        
        if (((criterion[i][0].name === answers[j][0].name &&
              criterion[i][0].anchor === answers[j][0].anchor) &&
             (criterion[i][1].name === answers[j][1].name &&
              criterion[i][1].anchor === answers[j][1].anchor))) {
          
          correct_join = true;
          
          if (answers[j][2].angle < 0)
            answers[j][2].angle += 360;
          
          if (answers[j][2].angle < criterion[i][2].angle.max &&
              answers[j][2].angle > criterion[i][2].angle.min) {
            
            correct_angle = true;
          }
          
          if (Math.abs(criterion[i][2].scaleX - answers[j][2].scaleX) < .05 &&
              Math.abs(criterion[i][2].scaleY - answers[j][2].scaleY) < .05) {
            correct_scale = true;
          }
            
          break;
        }
      };
      
      $("table.mark tbody").append("<tr><td>" + i + "</td><td>" + [criterion[i][0].name, criterion[i][1].name].join(" - ") + "</td><td>" + (correct_join ? "Yes" : "No") + "</td><td>" + (correct_angle ? "Yes" : "No") + "</td><td>" + (correct_scale ? "Yes" : "No") + "</td></tr>");
    };
    
    //console.log("join: " + count + " / " + criterion.length);
    //console.log("angle: " + count_angle + " / " + count);
    
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
  
  /*
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
  */
};

