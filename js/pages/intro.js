
$(document).ready(function() {

  $("#start").click(function(event) {
    
    event.preventDefault();
    
    $('#quiz').modal('show');
  });
  
  $('input[name="engineering_sketching"]').change(function() {
  
    if ($('input[name="engineering_sketching"]:checked').val() === "Static_ES"){
      
      $('input[name="static_es"]').parent().show();
      
      if ($('input[name="static_es"]:checked').val() === "Equipment") {
        
        $('input[name="equipment"]').parent().show();
      }
      
    } else {
      
      $('input[name="static_es"]').parent().hide();
      $('input[name="equipment"]').parent().hide();
    }
  });
  
  $('input[name="static_es"]').change(function() {
  
    if ($('input[name="static_es"]:checked').val() === "Equipment"){
      
      $('input[name="equipment"]').parent().show();
      
    } else {
      
      $('input[name="equipment"]').parent().hide();
    }
  });
  

  $("#start_quiz").click(function(event){
  
    event.preventDefault();
    
    var username = $("#zpass").val();
    var option_1 = $('input[name="engineering_sketching"]:checked').val();
    var option_2 = $('input[name="static_es"]:checked').val();
    var option_3 = $('input[name="equipment"]:checked').val();
    

    if (option_3 === "Excavator")
      var quiz_window = window.open("./excavator.html");
    
    //quiz_window.username = username;
    //quiz_window.option = option;
    
    $('#quiz').modal('hide');
    
  });

});