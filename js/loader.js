function Loader(json) {
  
  var answer = {"objects":[{"id":0,"type":"images/sample_1.png","transform":"t525.2249623919338,-88.15308966198177s1.0532,1.0532,0,0r53.1613,0,0"},{"id":1,"type":"images/sample_2.png","transform":"t-306.6675098656182,388.1429364278934s0.9184,0.9184,0,0r-74.2196,0,0"},{"id":2,"type":"images/sample_3_1.png","transform":"t302.75791087066506,-59.701503102629815r51.4455,0,0","components":"t302.75791087066506,-59.701503102629815r51.4455,0,0"},{"id":3,"type":"images/sample_3_1.png","transform":"t-59.10450741153823,366.26310203387584r-68.5935,0,0","components":"t-59.10450741153823,366.26310203387584r-68.5935,0,0"},{"id":4,"type":"images/sample_3_1.png","transform":"t527.5743517122211,126.01823321104933r83.8269,0,0","components":"t527.5743517122211,126.01823321104933r83.8269,0,0"},{"id":5,"type":"images/sample_4.png","transform":"t53.19160205933379,-189.71904346353227r38.5981,0,0"},{"id":6,"type":"images/sample_4.png","transform":"t658.7492727608633,146.84228686489186r123.7643,0,0"},{"id":7,"type":"images/sample_5.png","transform":"t357.0579807898634,899.7187572078918r168.509,0,0"},{"id":8,"type":"images/sample_6.png","transform":"t87.99950960722106,-182.01906360895066"},{"id":9,"type":"images/sample_7.png","transform":"t248.58350960722106,-213.4092636089507s1.1651,1.1651,0,0"},{"id":10,"type":"images/sample_8.png","transform":""},{"id":11,"type":"images/sample_9.png","transform":""}],"relationships":[[{"equipment":0,"anchor":0,"type":"images/sample_1.png"},{"equipment":1,"anchor":2,"type":"images/sample_2.png"}],[{"equipment":0,"anchor":2,"type":"images/sample_1.png"},{"equipment":2,"anchor":0,"type":"images/sample_3_1.png"}],[{"equipment":0,"anchor":3,"type":"images/sample_1.png"},{"equipment":8,"anchor":1,"type":"images/sample_6.png"}],[{"equipment":1,"anchor":0,"type":"images/sample_2.png"},{"equipment":7,"anchor":0,"type":"images/sample_5.png"}],[{"equipment":1,"anchor":1,"type":"images/sample_2.png"},{"equipment":5,"anchor":1,"type":"images/sample_4.png"}],[{"equipment":1,"anchor":4,"type":"images/sample_2.png"},{"equipment":3,"anchor":0,"type":"images/sample_3_1.png"}],[{"equipment":4,"anchor":0,"type":"images/sample_3_1.png"},{"equipment":8,"anchor":0,"type":"images/sample_6.png"}],[{"equipment":6,"anchor":1,"type":"images/sample_4.png"},{"equipment":7,"anchor":1,"type":"images/sample_5.png"}],[{"equipment":8,"anchor":2,"type":"images/sample_6.png"},{"equipment":9,"anchor":0,"type":"images/sample_7.png"}]]};
  
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