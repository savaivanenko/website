$(function(){
  var link = $('.menu-link');
  console.log(link);
  link.click(function(event){
    link.removeClass('active');
    $(event.target).addClass('active');
  });
});