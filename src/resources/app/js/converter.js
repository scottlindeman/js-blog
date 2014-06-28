$(function () {
  
  if (typeof Showdown !== "undefined") {
    
    var ConverterContainer = {
      Converter : new Showdown.converter()
    };

    $.extend(BlogApp, ConverterContainer);
  }
});
