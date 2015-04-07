function Alert() {
}

Alert.prototype.show = function() {
  window.setTimeout(function() { // hide alert message
    $('.notice').fadeTo(2000, 500).slideUp(500, function(){
        $('.notice').alert('close');
    });
  }, 2000);
}