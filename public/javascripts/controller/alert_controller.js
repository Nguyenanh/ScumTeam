function Alert() {
}
Alert.prototype.show = function() {
  window.setTimeout(function() { // hide alert message
    $('.notice').fadeOut(2000);
  }, 2000);
}