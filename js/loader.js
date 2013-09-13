function Loader(json) {
  
  var answer = {"objects":[{"id":0,"transform":"t510.00922955419605,-60.712889403481825s1.1246,1.1246,0,0r56.9788,0,0"},{"id":1,"transform":"t-354.6690451962932,293.6673518878445s0.8565,0.8565,0,0r-63.0516,0,0"},{"id":2,"transform":"t434.0055569772006,-195.80397608619253r50.7835,0,0"},{"id":3,"transform":"t-364.7132245892714,208.61901103277924r-57.0574,0,0"},{"id":4,"transform":"t731.9327650404776,152.0189134432122r86.2624,0,0"},{"id":5,"transform":"t92.50009923350967,824.6267380898754r230.2131,0,0"},{"id":6,"transform":"t-345.53019186168547,724.3391478755841r-77.9364,0,0"},{"id":7,"transform":"t458.30260202610253,681.509915649644s0.8472,0.8472,0,0r139.3354,0,0"},{"id":8,"transform":"t30,-126"},{"id":9,"transform":"t217,-58"},{"id":10,"transform":""},{"id":11,"transform":""}],"relationships":[[{"equipment":0,"anchor":0},{"equipment":1,"anchor":2}],[{"equipment":0,"anchor":2},{"equipment":2,"anchor":1}],[{"equipment":0,"anchor":3},{"equipment":8,"anchor":1}],[{"equipment":1,"anchor":0},{"equipment":7,"anchor":0}],[{"equipment":1,"anchor":1},{"equipment":5,"anchor":0}],[{"equipment":1,"anchor":4},{"equipment":3,"anchor":1}],[{"equipment":4,"anchor":1},{"equipment":8,"anchor":0}],[{"equipment":6,"anchor":0},{"equipment":7,"anchor":1}],[{"equipment":8,"anchor":2},{"equipment":9,"anchor":0}]]};
  
  var i;
  
  for (i = 0; i < Panel.equipments.length; i++) {
  
    var equipment = Panel.equipments[i];
    
    equipment.transform.applyTransform(answer.objects[i].transform);
    
    equipment.transform.resetCenter();
    equipment.transform.updateHistory();
  }
  
  for (i = 0; i < answer.relationships.length; i++) {
    
    var relationship = answer.relationships[i];
    
    Anchor.Join(
      Panel.equipments[relationship[0].equipment].anchors[relationship[0].anchor], Panel.equipments[relationship[1].equipment].anchors[relationship[1].anchor]
    );
    
    Panel.equipments[relationship[0].equipment].transform.translateDone();
    Panel.equipments[relationship[1].equipment].transform.translateDone();
  }
}