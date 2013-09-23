function Loader(json) {
  
  var answer = {"objects":[{"id":0,"transform":"t532.2230900787142,-78.16036929721302s1.0532,1.0532,0,0r53.1613,0,0"},{"id":1,"transform":"t-347.67455556868947,155.0158590122715s0.9184,0.9184,0,0r-49.8135,0,0"},{"id":2,"transform":"t309.7561238738289,-49.70874852981949r51.4455,0,0","components":"t309.7561238738289,-49.70874852981949r51.4455,0,0"},{"id":3,"transform":"t-113.19304577431848,237.38463931250845r-44.1874,0,0","components":"t-113.19304577431848,237.38463931250845r-44.1874,0,0"},{"id":4,"transform":"t534.5726119696507,136.01100841641608r83.8269,0,0","components":"t534.5726119696507,136.01100841641608r83.8269,0,0"},{"id":5,"transform":"t128.30326290170234,-229.4941275199476r53.0021,0,0"},{"id":6,"transform":"t-442.6442817953585,524.0185374240028r-58.272,0,0"},{"id":7,"transform":"t283.3804372574033,874.7072961194496r169.15,0,0"},{"id":8,"transform":"t94.99763729400149,-172.02634324418193"},{"id":9,"transform":"t281.9976372940015,-104.02634324418193"},{"id":10,"transform":""},{"id":11,"transform":""}],"relationships":[[{"equipment":0,"anchor":0},{"equipment":1,"anchor":2}],[{"equipment":0,"anchor":2},{"equipment":2,"anchor":0}],[{"equipment":0,"anchor":3},{"equipment":8,"anchor":1}],[{"equipment":1,"anchor":0},{"equipment":7,"anchor":0}],[{"equipment":1,"anchor":1},{"equipment":5,"anchor":1}],[{"equipment":1,"anchor":4},{"equipment":3,"anchor":0}],[{"equipment":4,"anchor":0},{"equipment":8,"anchor":0}],[{"equipment":6,"anchor":0},{"equipment":7,"anchor":1}],[{"equipment":8,"anchor":2},{"equipment":9,"anchor":0}]]};
  
  var i;
  
  for (i = 0; i < Panel.equipments.length; i++) {
  
    var equipment = Panel.equipments[i];
    
    equipment.transform.applyTransform(answer.objects[i].transform);
    
    if (answer.objects[i].components) {
      
      equipment.components.transform.applyTransform(
        answer.objects[i].components);
      
      equipment.components.transform.transformDone();
    }
    
    equipment.transform.resetCenter();
    equipment.transform.transformDone();
    //equipment.transform.updateHistory();
  }
  
  for (i = 0; i < answer.relationships.length; i++) {
    
    var relationship = answer.relationships[i];
    
    Anchor.Join(
      Panel.equipments[relationship[0].equipment].anchors[relationship[0].anchor], Panel.equipments[relationship[1].equipment].anchors[relationship[1].anchor]
    );
    
    //Panel.equipments[relationship[0].equipment].transform.translateDone();
    //Panel.equipments[relationship[1].equipment].transform.translateDone();
  }
}