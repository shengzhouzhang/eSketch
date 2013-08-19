var Anchor = function(canves) {
  
  var activitedPoints = [];
  var MagnetRadius = 20;
  
  this.light = function(point) {
    
    point.attr({fill: "red"});
    
    point.status = "normal";
  };
  
  this.hover = function(point) {
    
    point.attr({fill: "green"});
    
    point.status = "hover";
  }
  
  this.activite = function(point) {
    
    point.attr({fill: "yellow"});
     
    point.status = "activited";
  }
  
  this.Create = function(options) {
    
    var anchor = this;
    
    var point = canves.circle(options.x, options.y, options.size);
    
    point.set = options.set;
    
    anchor.light(point);
    
    // hover event
    point.hover(function(){
      
      if (point.status !== "activited") {
        
        anchor.hover(point);
      }
      
    }, function(){
      
      if (point.status === "hover")
        anchor.light(point);
    });
    
    // click event
    point.click(function(){
      
      activitedPoints.push(this);
      
      if(activitedPoints.length > 2) {
        
        anchor.light(activitedPoints[0]);
        
        activitedPoints.splice(0, 1);
      }
      
      if (point.status !== "activited") {
        
        anchor.activite(point);
        
      } else {
        
        point.status = "hover";
      }
    });
    
    point.positionX = function() {
   
      return point.attrs.cx + point.set[0].ft.attrs.translate.x;
    }
      
    point.positionY = function() {
   
      point.attrs.cy + point.set[0].ft.attrs.translate.y;
    }
    
    return point;
  };
  
  this.Magnet = function() {
    
    if (activitedPoints.length === 2) {
      
      //console.log(activitedPoints[0]);
      
      if (Math.abs(activitedPoints[0].positionX() - activitedPoints[1].positionX()) < MagnetRadius || Math.abs(activitedPoints[0].positionY() - activitedPoints[1].positionY()) < MagnetRadius) {
        
        console.log("haha");
      }
    }
  };
}