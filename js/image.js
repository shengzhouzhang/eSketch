var Image = function(canves) {
  
  var images = [];
  
  var anchorFactory = new Anchor(canves);
  
  this.Create = function (url, x, y, width, height, points) {
  
    // initial image
    var img = canves.image(url, x, y, width, height);
    
    var set = canves.set();
    set.push(img);
    
    // define action points
    points.forEach(function(point) {
      
      set.push(anchorFactory.Create({x: x + point.x, y: y + point.y, size: point.size, set: set}));
    });
    
    var ftOptions = {draw: ["bbox"], scale: ["bboxCorners", "bboxSides"], rotate: ["axisX"], drag: ["center", "self"], keepRatio: ["bboxCorners"]};
    
    // apply free transform
    img.ft = canves.freeTransform(set, ftOptions, function(ft, events) {
      
      // update attributes
      var item = $("ul.attributes > li:eq(" + ft.id + ")");
      
      item.find("span.rotate").html(img.ft.attrs.rotate.toFixed(1));
      item.find("span.scaleX").html(img.ft.attrs.scale.x.toFixed(1));
      item.find("span.scaleY").html(img.ft.attrs.scale.y.toFixed(1));
      
      anchorFactory.Magnet();
    });
    
    img.ft.hideHandles({undrag: false});
    
    
    // push image to image list
    img.ft.id = images.length;
    images.push(set);
    
    // initial variables
    $("li.info").before($("<li>").html("<span class='scaleX'></span><span class='scaleY'></span><span class='rotate'></span>").addClass("number"));
    
    img.mousedown(function(){
    
      img.ft.status = "activited";
    });
    
    // define the click function
    img.mouseup(function(event) {
      
      img.ft.showHandles();
      
      
      // close all images' handles
      images.forEach(function(set) {
        
        if(event.target !== set[0][0])
          set[0].ft.hideHandles({undrag: false});
      });
      
      $("ul.attributes > li").removeClass("activited");
      $("ul.attributes > li:eq(" + img.ft.id + ")").addClass("activited");
      
    });
    
    
    return img;
  };

};



