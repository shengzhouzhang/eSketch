function Loader(json) {
  
  var answer = {"objects":[{"id":0,"type":"images/sample_1.png","transform":"t643.157936175952,62.261271584458555s0.7635,0.7635,0,0r11.6161,0,0"},{"id":1,"type":"images/sample_2.png","transform":"t155.21343628123202,366.50325210065057s0.7,0.7,0,0r-54.7956,0,0"},{"id":2,"type":"images/sample_3_1.png","transform":"t563.9892800240616,213.69846673870336s0.5875,0.5875,0,0r6.9266,0,0","components":"t563.9892800240616,213.69846673870336s0.5875,0.5875,0,0r6.9266,0,0"},{"id":3,"type":"images/sample_3_1.png","transform":"t372.608012060032,435.9272996830506s0.7,0.7,0,0r-57.7109,0,0","components":"t372.608012060032,435.9272996830506s0.7,0.7,0,0r-57.7109,0,0"},{"id":4,"type":"images/sample_3_1.png","transform":"t772.6522122918619,152.65583768812047s0.7,0.7,0,0r52.2335,0,0","components":"t772.6522122918619,152.65583768812047s0.7,0.7,0,0r52.2335,0,0"},{"id":5,"type":"images/sample_4.png","transform":"t852.81213692295,449.1914486240515s0.7,0.7,0,0r141.4591,0,0"},{"id":6,"type":"images/sample_4.png","transform":"t527.2037732372321,44.827406476650594s0.7,0.7,0,0r56.2561,0,0"},{"id":7,"type":"images/sample_5.png","transform":"t502.79692269339785,831.3615608898241s0.6397,0.6397,0,0r188.2909,0,0"},{"id":8,"type":"images/sample_6.png","transform":"t603.002011372362,-46.74469043937952s0.7,0.7,0,0"},{"id":9,"type":"images/sample_7.png","transform":"t733.9020113723619,0.8553095606204764s0.7,0.7,0,0"},{"id":10,"type":"images/sample_8.png","transform":"t40.5,39s0.7,0.7,0,0"},{"id":11,"type":"images/sample_9.png","transform":"t112.5,39s0.7,0.7,0,0"},{"id":12,"type":"images/sample_10.png","transform":"t341,223.75s0.7,0.7,0,0"}],"relationships":[[{"equipment":0,"anchor":0,"type":"images/sample_1.png"},{"equipment":1,"anchor":2,"type":"images/sample_2.png"},{"angle":215}],[{"equipment":0,"anchor":2,"type":"images/sample_1.png"},{"equipment":2,"anchor":0,"type":"images/sample_3_1.png"},{"angle":-132}],[{"equipment":0,"anchor":3,"type":"images/sample_1.png"},{"equipment":8,"anchor":1,"type":"images/sample_6.png"},{"angle":-123}],[{"equipment":1,"anchor":0,"type":"images/sample_2.png"},{"equipment":7,"anchor":0,"type":"images/sample_5.png"},{"angle":174}],[{"equipment":1,"anchor":1,"type":"images/sample_2.png"},{"equipment":6,"anchor":1,"type":"images/sample_4.png"},{"angle":95}],[{"equipment":1,"anchor":4,"type":"images/sample_2.png"},{"equipment":3,"anchor":0,"type":"images/sample_3_1.png"},{"angle":-21}],[{"equipment":4,"anchor":0,"type":"images/sample_3_1.png"},{"equipment":8,"anchor":0,"type":"images/sample_6.png"},{"angle":-100}],[{"equipment":5,"anchor":1,"type":"images/sample_4.png"},{"equipment":7,"anchor":1,"type":"images/sample_5.png"},{"angle":199}],[{"equipment":8,"anchor":2,"type":"images/sample_6.png"},{"equipment":9,"anchor":0,"type":"images/sample_7.png"},{"angle":211}]]};
  
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