
$(document).ready(function() {

  $("#start").click(function(event) {
    
    event.preventDefault();
    
    $('#quiz').modal('show');
  });
  
  $("#start_quiz").click(function(event){
  
    event.preventDefault();
    
    var username = $("#zpass").val();
    var option = $('input[name="cases"]:checked').val();
    
    var quiz_window = window.open("./");
    
    quiz_window.username = username;
    quiz_window.option = option;
    
    $('#quiz').modal('hide');
    
  });
});