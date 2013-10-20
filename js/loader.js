function Loader(panel) {
  
  var answer = {"objects":[{"class":"5","type":"images/sample_6.png","transform":"t539.9999224480875,126.499959362106s0.7,0.7,0,0"},{"class":"6","type":"images/sample_7.png","transform":"t509.8999224480875,230.099959362106s0.7,0.7,0,0"},{"class":"0","type":"images/sample_1.png","transform":"t499.7634465901875,-38.00498319789395s0.7,0.7,0,0r30.8979,0,0"},{"class":"1","type":"images/sample_2.png","transform":"t243.7358836003876,184.13213725070602s0.7,0.7,0,0r-28.1852,0,0"},{"class":"2","type":"images/sample_3_1.png","transform":"t338.50224857616075,155.1809303964069s0.5626,0.5626,0,0r-30.0457,0,0","component":"t338.50224857616075,155.1809303964069s0.5626,0.5626,0,0r-30.0457,0,0"},{"class":"4","type":"images/sample_5.png","transform":"t582.6307226039548,359.48163245519646s0.5976,0.5976,0,0r164.7616,0,0"},{"class":"2","type":"images/sample_3_1.png","transform":"t82.5,34.5s0.7,0.7,0,0","component":"t82.5,34.5s0.7,0.7,0,0"},{"class":"2","type":"images/sample_3_1.png","transform":"t731.5563168401461,32.93637124617075s0.7,0.7,0,0r73.4925,0,0","component":"t731.5563168401461,32.93637124617075s0.7,0.7,0,0r73.4925,0,0"},{"class":"2","type":"images/sample_3_1.png","transform":"t560.9216005185727,10.715039053404258s0.4729,0.4729,0,0r34.5442,0,0","component":"t560.9216005185727,10.715039053404258s0.4729,0.4729,0,0r34.5442,0,0"},{"class":"3","type":"images/sample_4.png","transform":"t69,37.5s0.7,0.7,0,0"},{"class":"3","type":"images/sample_4.png","transform":"t374.88433935112147,365.9894133641203s0.7,0.7,0,0r261.1467,0,0"},{"class":"3","type":"images/sample_4.png","transform":"t199.53905035438586,295.0941814477013s0.7,0.7,0,0r-44.1901,0,0"}],"relationships":[[{"equipment":0,"anchor":0,"type":"images/sample_6.png"},{"equipment":7,"anchor":0,"type":"images/sample_3_1.png"},{"angle":77}],[{"equipment":0,"anchor":1,"type":"images/sample_6.png"},{"equipment":2,"anchor":3,"type":"images/sample_1.png"},{"angle":101}],[{"equipment":0,"anchor":2,"type":"images/sample_6.png"},{"equipment":1,"anchor":0,"type":"images/sample_7.png"},{"angle":210}],[{"equipment":2,"anchor":0,"type":"images/sample_1.png"},{"equipment":3,"anchor":2,"type":"images/sample_2.png"},{"angle":-152}],[{"equipment":2,"anchor":2,"type":"images/sample_1.png"},{"equipment":8,"anchor":0,"type":"images/sample_3_1.png"},{"angle":-140}],[{"equipment":3,"anchor":1,"type":"images/sample_2.png"},{"equipment":10,"anchor":0,"type":"images/sample_4.png"},{"angle":95}],[{"equipment":3,"anchor":4,"type":"images/sample_2.png"},{"equipment":4,"anchor":0,"type":"images/sample_3_1.png"},{"angle":-22}],[{"equipment":5,"anchor":1,"type":"images/sample_5.png"},{"equipment":11,"anchor":0,"type":"images/sample_4.png"},{"angle":-220}]]};
  
  (function() {
  
    answer.objects.forEach(function(equipment) {
    
      panel.createEquipment(equipment.class);
    });
  })();
  
  var i;
  
  for (i = 0; i < Panel.equipments.length; i++) {
  
    var equipment = Panel.equipments[i];
    
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