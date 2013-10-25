function Loader(panel) {
  
  /*
  var answer = {"objects":[{"name":"Upper-Carriage","transform":"t638.9999662007735,172.500007011489s0.7,0.7,0,0"},{"name":"Lower-Carriage","transform":"t575.6849662007735,266.420207011489s0.7949,0.7949,0,0"},{"name":"Boom","transform":"t781.5103279399735,-80.72306752721099s0.7,0.7,0,0r60.252,0,0"},{"name":"Stick","transform":"t447.0443027697736,-6.596676646010977s0.7,0.7,0,0"},{"name":"Bucket","transform":"t401.0696883766463,232.05205213547163s0.6306,0.6306,0,0r-77.5336,0,0"}],"relationships":[[{"name":"Upper-Carriage","id":0,"anchor":1},{"name":"Boom","id":2,"anchor":3},{"angle":72,"scaleX":"1.00","scaleY":"1.00"}],[{"name":"Upper-Carriage","id":0,"anchor":2},{"name":"Lower-Carriage","id":1,"anchor":0},{"angle":210,"scaleX":"0.88","scaleY":"0.88"}],[{"name":"Boom","id":2,"anchor":0},{"name":"Stick","id":3,"anchor":2},{"angle":-151,"scaleX":"1.00","scaleY":"1.00"}],[{"name":"Stick","id":3,"anchor":0},{"name":"Bucket","id":4,"anchor":0},{"angle":134,"scaleX":"1.11","scaleY":"1.11"}]]};
  */
  
  var answer = {"objects":[{"name":"Upper-Carriage","transform":"t473.5001567165841,202.74993374799175s0.7,0.7,0,0"},{"name":"Lower-Carriage","transform":"t449.0001567165841,288.84993374799177s0.7,0.7,0,0"},{"name":"Boom","transform":"t541.1267526107841,3.859871726991792s0.7,0.7,0,0r48.6334,0,0"},{"name":"Stick","transform":"t433.93401273768416,411.15589592429177s0.7,0.7,0,0r-85.3095,0,0"},{"name":"Bucket","transform":"t691.0679316228841,143.2214542780918s0.7,0.7,0,0r98.9346,0,0"}],"relationships":[[{"name":"Upper-Carriage","id":0,"anchor":1},{"name":"Boom","id":2,"anchor":3},{"angle":77,"scaleX":"1.00","scaleY":"1.00"}],[{"name":"Upper-Carriage","id":0,"anchor":2},{"name":"Lower-Carriage","id":1,"anchor":0},{"angle":216,"scaleX":"1.00","scaleY":"1.00"}],[{"name":"Boom","id":2,"anchor":0},{"name":"Stick","id":3,"anchor":2},{"angle":-78,"scaleX":"1.00","scaleY":"1.00"}],[{"name":"Stick","id":3,"anchor":0},{"name":"Bucket","id":4,"anchor":0},{"angle":236,"scaleX":"1.00","scaleY":"1.00"}]]};
  
  (function() {
  
    answer.objects.forEach(function(equipment) {
    
      panel.createEquipmentbyName(equipment.name);
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
      Panel.equipments[relationship[0].id].anchors[relationship[0].anchor],
      Panel.equipments[relationship[1].id].anchors[relationship[1].anchor]
    );
  }
  
  Equipment.saveAll();
}