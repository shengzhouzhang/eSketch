var equipmentsData = [
  {type: "equipment", name: "Stick", layer: 1, url: "images/sample_1.png", x: 10, y: 280, width: 350, length: 90, anchors: [
    {layer: 1, x: 8, y: 82, radius: 4},
    {layer: 1, x: 180, y: 15, radius: 4},
    {layer: 1, x: 135, y: 7, radius: 4},
    {layer: 1, x: 343, y: 82, radius: 4}
  ], grade: 2,
   youtube: "http://www.youtube.com/watch?v=u6QIpXca9D4",
   wikipedia: "http://en.wikipedia.org/wiki/Backhoe"
  },
  {type: "equipment", name: "Boom", layer: 1, url: "images/sample_2.png", x: 180, y: 430, width: 300, length: 80, anchors: [
    {layer: 1, x: 9, y: 71, radius: 4},
    {layer: 1, x: 45, y: 66, radius: 4},
    {layer: 1, x: 223, y: 65, radius: 5},
    {layer: 1, x: 290, y: 38, radius: 5},
    {layer: 1, x: 215, y: 11, radius: 4}
  ], grade: 3,
   youtube: "http://www.youtube.com/watch?v=u6QIpXca9D4",
   wikipedia: "http://en.wikipedia.org/wiki/Backhoe"
  },
  {type: "equipment", name: "Cylinder", layer: 1, url: "images/sample_3_1.png", x: 120, y: 100, width: 150, length: 30, anchors: [
    {layer: 1, x: 140, y: 15, radius: 4}
  ], links: [
    {layer: 2, x: 40, y: 20, width: 5, height: 10},
    {layer: 2, x: 130, y: 20, width: 5, height: 10}
  ], components: [
    {layer: 1, url: "images/sample_3_2.png", width: 150, length: 20, x: -40, y:5, anchors: [
      {x: 10, y: 10, radius: 4, color: "orange"}
    ]},
  ], grade: 5,
    youtube: "http://youtu.be/kS986THGE24",
    wikipedia: "http://en.wikipedia.org/wiki/Hydraulic_cylinder"
  },
  {type: "equipment", name: "Cylinder", layer: 1, url: "images/sample_3_1.png", x: 150, y: 130, width: 150, length: 30, anchors: [
    {layer: 1, x: 140, y: 15, radius: 4}
  ], links: [
    {layer: 2, x: 40, y: 20, width: 5, height: 10},
    {layer: 2, x: 130, y: 20, width: 5, height: 10}
  ], components: [
    {layer: 1, url: "images/sample_3_2.png", width: 150, length: 20, x: -40, y:5, anchors: [
      {x: 10, y: 10, radius: 4, color: "orange"}
    ]},
  ], grade: 5,
    youtube: "http://youtu.be/kS986THGE24",
    wikipedia: "http://en.wikipedia.org/wiki/Hydraulic_cylinder"
  },
  {type: "equipment", name: "Cylinder", layer: 1, url: "images/sample_3_1.png", x: 180, y: 160, width: 150, length: 30, anchors: [
    {layer: 1, x: 140, y: 15, radius: 4}
  ], links: [
    {layer: 2, x: 40, y: 20, width: 5, height: 10},
    {layer: 2, x: 130, y: 20, width: 5, height: 10}
  ], components: [
    {layer: 1, url: "images/sample_3_2.png", width: 150, length: 20, x: -40, y:5, anchors: [
      {x: 10, y: 10, radius: 4, color: "orange"}
    ]},
  ], grade: 5,
    youtube: "http://youtu.be/kS986THGE24",
    wikipedia: "http://en.wikipedia.org/wiki/Hydraulic_cylinder"
  },
  {type: "equipment", name: "", layer: 1, url: "images/sample_4.png", x: 370, y: 300, width: 60, length: 50, anchors: [
    {x: 10, y: 41, radius: 4}
  ], grade: 6},
  {type: "equipment", name: "", layer: 1, url: "images/sample_4.png", x: 420, y: 300, width: 60, length: 50, anchors: [
    {x: 10, y: 41, radius: 4}
  ], grade: 6},
  {type: "equipment", name: "Bucket", layer: 1, url: "images/sample_5.png", x: 10, y: 420, width: 150, length: 170, anchors: [
    {layer: 1, x: 50, y: 157, radius: 4},
    {layer: 1, x: 95, y: 147, radius: 4}
  ], links: [
    {layer: 1, x: 145, y: 75, width: 10, height: 5}
  ], grade: 4,
   youtube: "http://youtu.be/MCc6eK56afw",
   wikipedia: "http://en.wikipedia.org/wiki/Bucket_%28machine_component%29"
  },
  {type: "equipment", name: "Upper-Carriage", layer: 1, url: "images/sample_6.png", x: 240, y: 520, width: 300, length: 150, anchors: [
    {layer: 1, x: 60, y: 125, radius: 5, opacity: 0.5},
    {layer: 1, x: 115, y: 100, radius: 5, opacity: 0.5},
    {layer: 1, x: 107, y: 150, radius: 5, opacity: 0.5}
  ], slots: [
    {layer: 2, x: 150, y: 52, width: 120, height: 70, opacity: 0.5, text: "Click Me"}
  ], grade: 0,
   youtube: "http://youtu.be/_y_JGA5gzss",
   wikipedia: "http://en.wikipedia.org/wiki/Continuous_track"
  },
  {type: "equipment", name: "Lower-Carriage", layer: 1, url: "images/sample_7.png", x: 10, y: 600, width: 300, length: 70, anchors: [
    {layer: 1, x: 150, y: 2, radius: 5, opacity: 0.5},
  ], grade: 1,
    youtube: "http://youtu.be/21pS_Z-NCRM",
    wikipedia: "http://en.wikipedia.org/wiki/Continuous_track"
  },
    {type: "equipment", name: "Engine", window: 1, url: "images/sample_8.png", x: 100, y: 100, width: 70, length: 60, anchors: [
  ], grade: 0,
   youtube: "http://youtu.be/izaQ4qiMU14",
   wikipedia: "http://en.wikipedia.org/wiki/Diesel_engine"
  },
  {type: "equipment", name: "Valve Block", window: 1, url: "images/sample_9.png", x: 300, y: 100, width: 150, length: 60, links: [
    {x: 15, y: 49, radius: 5, location: "lower"},
    {x: 38, y: 49, radius: 5, location: "lower"},
    {x: 62, y: 49, radius: 5, location: "lower"},
    {x: 86, y: 49, radius: 5, location: "lower"},
    {x: 110, y: 49, radius: 5, location: "lower"},
    {x: 134, y: 49, radius: 5, location: "lower"},
    {x: 15, y: 36, radius: 5, location: "upper"},
    {x: 38, y: 36, radius: 5, location: "upper"},
    {x: 62, y: 36, radius: 5, location: "upper"},
    {x: 86, y: 36, radius: 5, location: "upper"},
    {x: 110, y: 36, radius: 5, location: "upper"},
    {x: 134, y: 36, radius: 5, location: "upper"},
  ], grade: 0,
    youtube: "http://youtu.be/vY_bguSNgSc",
    wikipedia: "http://en.wikipedia.org/wiki/Directional_control_valve"
  },
  {type: "equipment", name: "Pipe", layer: 1, url: "images/sample_10.png", x: 100, y: 500, width: 120, length:50, links: [
    {layer: 1, x: 55, y: -5, width: 5, height: 10}
  ], grade: 9,
   youtube: "http://youtu.be/vY_bguSNgSc",
   wikipedia: "http://en.wikipedia.org/wiki/Directional_control_valve"
  }
];