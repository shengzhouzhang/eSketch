var Anchor = function(canves) {
  
  var activitedPoints = [];
  var MagnetRadius = 30;
  var MagentField = [];
  var MagentFieldStatus = "undraw";
  this.MagnetStatus = "notready";
  
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
    point.hover(function() {
      
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
      
      if(activitedPoints.length === 2 && activitedPoints[0].set === this.set) {
          
        activitedPoints.splice(1, 1);  
        
      } else if (activitedPoints.length > 2 && activitedPoints[1].set === this.set) {
        
        activitedPoints.splice(2, 1);
      } else {
            
        console.log(2);
        
        if (activitedPoints.length > 2) {
          
          anchor.light(activitedPoints[0]);
          activitedPoints.splice(0, 1);
        }
        
        if (point.status !== "activited") {
        
          anchor.activite(point);
        
        } else {
        
          point.status = "hover";
        }
        
        anchor.MagnetReset();
      }
      
    });
    
    point.positionX = function() {
   
      return point.matrix.x(point.attrs.cx, point.attrs.cy);
    }
      
    point.positionY = function() {
   
      return point.matrix.y(point.attrs.cx, point.attrs.cy);
    }
    
    return point;
  };
  
  this.Magnet = function() {
    
    if (activitedPoints.length === 2 && (activitedPoints[0].set[0].ft.status === "activited" || activitedPoints[1].set[0].ft.status === "activited")) {
      
      if (Math.abs(activitedPoints[0].positionX() - activitedPoints[1].positionX()) < MagnetRadius && Math.abs(activitedPoints[0].positionY() - activitedPoints[1].positionY()) < MagnetRadius) {
        
        if (this.MagnetStatus !== "ready")
          this.MagnetStatus = "ready";
       
      } else {
        
        if (this.MagnetStatus !== "notready")
          this.MagnetStatus = "notready";
      }
      
      this.drawMagnetField();
    }
  };
  
  this.MagnetDistance = function() {
    
    var movePoint;
    var waitPoint;
    
    activitedPoints.forEach(function(point) {
    
      if (point.set[0].ft.status === "activited") {
        
        movePoint = point;
      } else {
        
        waitPoint = point;
      }
    });
    
    var distance = {};
    
    distance.x = waitPoint.positionX() - movePoint.positionX();
    distance.y = waitPoint.positionY() - movePoint.positionY();

    return distance;
  };
  
  this.MagnetReset = function() {
   
    this.MagnetStatus = "notready";
    this.deleteMagentField();
  };
  
  this.drawMagnetField = function() {
    
    if (MagentFieldStatus === "undraw") {
      
      activitedPoints.forEach(function(point) {
        
        if (point.set[0].ft.status !== "activited") {
          
          MagentField.push(canves.circle(point.positionX(), point.positionY(), MagnetRadius).attr({"stroke-dasharray": "--"}));
          
          MagentFieldStatus = "draw";
          
          return;
            }
      });
    }
  };
  
  this.deleteMagentField = function() {
    
    if (MagentFieldStatus === "draw") {
      
      MagentField.forEach(function(field){
      
        field.remove();
      });
      
      MagentFieldStatus = "undraw";
    }
  };
    
    
  this.join = function() {
    
    if (activitedPoints.length !== 2)
      return;
    
    if (activitedPoints[0].set.superset === undefined || activitedPoints[1].set.superset === undefined) {
      
      var superset = canves.set();
      
      superset.push(activitedPoints[0].set);
      superset.push(activitedPoints[1].set);
      
      activitedPoints[0].set[0].ft.hideHandles({undrag: true});
      activitedPoints[1].set[0].ft.hideHandles({undrag: true});
      
      var ftOptions = {draw: ["bbox"], scale: ["bboxCorners", "bboxSides"], rotate: ["axisX"], drag: ["center", "self"], keepRatio: ["bboxCorners"]};
      
      superset.ft = canves.freeTransform(superset, ftOptions, function(ft, events) {
        
      });
      
      activitedPoints[0].set.superset = superset;
      activitedPoints[1].set.superset = superset;
      
    } else if (activitedPoints[0].set.superset !== undefined) {
      
      activitedPoints[0].set.superset.push(activitedPoints[1]);
      
    } else if (activitedPoints[1].set.superset !== undefined) {
      
      activitedPoints[1].set.superset.push(activitedPoints[0]);
      
    } else if (activitedPoints[0].set.superset !== activitedPoints[1].set.superset) {
      
      activitedPoints[0].set.superset.forEach(function(item) {
        
        activitedPoints[1].set.superset.push(item);
      });
      
      activitedPoints[0].set.superset.clear();
    }
    
  }
    
}