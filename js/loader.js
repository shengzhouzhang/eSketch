function Loader(panel) {
  
  var answer = {"objects":[{"name":"Upper-Carriage","class":"5","type":"images/sample_6.png","transform":"t638.9999662007735,172.500007011489s0.7,0.7,0,0"},{"name":"Lower-Carriage","class":"6","type":"images/sample_7.png","transform":"t575.6796272177227,266.4186510792856s0.7949,0.7949,0,0"},{"name":"Boom","class":"0","type":"images/sample_1.png","transform":"t781.5103279399735,-80.72306752721094s0.7,0.7,0,0r60.252,0,0"},{"name":"Stick","class":"1","type":"images/sample_2.png","transform":"t447.0443027697736,-6.596676646010934s0.7,0.7,0,0"},{"name":"Bucket","class":"4","type":"images/sample_5.png","transform":"t401.0696883766463,232.05205213547165s0.6306,0.6306,0,0r-77.5336,0,0"}],"relationships":[[{"name":"Upper-Carriage","anchor":1},{"name":"Boom","anchor":3},{"angle":72,"scaleX":"1.00","scaleY":"1.00"}],[{"name":"Upper-Carriage","anchor":2},{"name":"Lower-Carriage","anchor":0},{"angle":210,"scaleX":"0.88","scaleY":"0.88"}],[{"name":"Lower-Carriage","anchor":0},{"name":"Upper-Carriage","anchor":2},{"angle":-210,"scaleX":"1.14","scaleY":"1.14"}],[{"name":"Boom","anchor":0},{"name":"Stick","anchor":2},{"angle":-151,"scaleX":"1.00","scaleY":"1.00"}],[{"name":"Boom","anchor":3},{"name":"Upper-Carriage","anchor":1},{"angle":-72,"scaleX":"1.00","scaleY":"1.00"}],[{"name":"Stick","anchor":0},{"name":"Bucket","anchor":0},{"angle":134,"scaleX":"1.11","scaleY":"1.11"}],[{"name":"Stick","anchor":2},{"name":"Boom","anchor":0},{"angle":151,"scaleX":"1.00","scaleY":"1.00"}],[{"name":"Bucket","anchor":0},{"name":"Stick","anchor":0},{"angle":-134,"scaleX":"0.90","scaleY":"0.90"}]]};
  
  (function() {
  
    answer.objects.forEach(function(equipment) {
    
      panel.createEquipment(equipment.class);
    });
  })();
  
  var i;
  
  var equipments = $.grep(Panel.equipments, function(item) {
    
    return item.layer == 1;
  });
  
  for (i = 0; i < equipments.length; i++) {
  
    var equipment = equipments[i];
    
    equipment.transform.applyTransform(answer.objects[i].transform);
    equipment.transform.resetCenter();
    
    if (answer.objects[i].component) {
      
      equipment.component.transform.applyTransform(
        answer.objects[i].component);
      equipment.component.transform.resetCenter();
    }
  }
  
  for (i = 0; i < answer.relationships.length; i++) {
    
    var relationship = answer.relationships[i];
    
    Anchor.Join(
      Panel.equipments[relationship[0].equipment].anchors[relationship[0].anchor], Panel.equipments[relationship[1].equipment].anchors[relationship[1].anchor]
    );
  }
  
  Equipment.saveAll();
}