function Loader(json) {
  
  var answer = {"objects":[{"id":0,"transform":"t539.2249623919338,-89.15308966198177s1.0532,1.0532,0,0r53.1613,0,0"},{"id":1,"transform":"t-292.6675098656182,387.1429364278934s0.9184,0.9184,0,0r-74.2196,0,0"},{"id":2,"transform":"t316.75791087066506,-60.701503102629765r51.4455,0,0","components":"t316.75791087066506,-60.701503102629765r51.4455,0,0"},{"id":3,"transform":"t-45.10450741153824,365.26310203387584r-68.5935,0,0","components":"t-45.10450741153824,365.26310203387584r-68.5935,0,0"},{"id":4,"transform":"t541.5743517122211,125.01823321104933r83.8269,0,0","components":"t541.5743517122211,125.01823321104933r83.8269,0,0"},{"id":5,"transform":"t67.19160205933379,-190.71904346353227r38.5981,0,0"},{"id":6,"transform":"t-358.8445592671366,556.1747915998918r-58.913,0,0"},{"id":7,"transform":"t371.0579807898634,898.7187572078918r168.509,0,0"},{"id":8,"transform":"t101.99950960722106,-183.01906360895066"},{"id":9,"transform":"t262.58350960722106,-214.4092636089507s1.1651,1.1651,0,0"},{"id":10,"transform":""},{"id":11,"transform":""}],"relationships":[[{"equipment":0,"anchor":0},{"equipment":1,"anchor":2}],[{"equipment":0,"anchor":2},{"equipment":2,"anchor":0}],[{"equipment":0,"anchor":3},{"equipment":8,"anchor":1}],[{"equipment":1,"anchor":0},{"equipment":7,"anchor":0}],[{"equipment":1,"anchor":1},{"equipment":5,"anchor":1}],[{"equipment":1,"anchor":4},{"equipment":3,"anchor":0}],[{"equipment":4,"anchor":0},{"equipment":8,"anchor":0}],[{"equipment":6,"anchor":0},{"equipment":7,"anchor":1}],[{"equipment":8,"anchor":2},{"equipment":9,"anchor":0}]]} ;
  
  var i;
  
  for (i = 0; i < Panel.equipments.length; i++) {
  
    var equipment = Panel.equipments[i];
    
    equipment.transform.applyTransform(answer.objects[i].transform);
    
    if (answer.objects[i].components) {
      
      equipment.components.transform.applyTransform(
        answer.objects[i].components);
      
      equipment.components.transform.transformDone();
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