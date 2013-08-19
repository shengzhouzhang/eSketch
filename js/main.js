
window.onload = function () {
  
  var canves = Raphael("canves");
  
  var imageFactory = new Image(canves);
  
  imageFactory.Create("images/sample_1.png", 10, 280, 350, 90, [
    {x: 8, y: 82, size: 4},
    {x: 180, y: 15, size: 4},
    {x: 135, y: 7, size: 4},
    {x: 343, y: 82, size: 4}
  ]);
  
  imageFactory.Create("images/sample_2.png", 180, 430, 300, 80, [
    {x: 9, y: 71, size: 4},
    {x: 45, y: 66, size: 4},
    {x: 223, y: 65, size: 5},
    {x: 290, y: 38, size: 5},
    {x: 215, y: 11, size: 4}
  ]);
  
  imageFactory.Create("images/sample_3.png", 90, 350, 200, 30, [
    {x: 10.5, y: 15, size: 4},
    {x: 190, y: 15, size: 4}
  ]);
  
  imageFactory.Create("images/sample_3.png", 120, 380, 200, 30, [
    {x: 10.5, y: 15, size: 4},
    {x: 190, y: 15, size: 4}
  ]);
  
  imageFactory.Create("images/sample_3.png", 150, 410, 200, 30, [
    {x: 10.5, y: 15, size: 4},
    {x: 190, y: 15, size: 4}
  ]);
  
  
  imageFactory.Create("images/sample_4.png", 370, 300, 60, 50, [
    {x: 10, y: 41, size: 3},
    {x: 49, y: 9, size: 3}
  ]);
  
  imageFactory.Create("images/sample_4.png", 420, 300, 60, 50, [
    {x: 10, y: 41, size: 3},
    {x: 49, y: 9, size: 3}
  ]);
  
  imageFactory.Create("images/sample_6.png", 240, 520, 300, 150, [

  ]);
  
  imageFactory.Create("images/sample_7.png", 10, 600, 300, 70, [

  ]);
  
  imageFactory.Create("images/sample_5.svg", 10, 420, 150, 170, [

  ]);
  
  //var newPath = new path(canves);

};