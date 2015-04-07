function Tooltip() {

}
Tooltip.prototype.show = function() {
   $('[data-toggle="tooltip"]').tooltip({
    placement : 'top'
  }); 
}