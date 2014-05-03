var BlogApp = {};

$(function () {
  var UtilContainer = {
    Util : {
      ARTICLEPATH : "/articles/"
    }
  };
  $.extend(BlogApp, UtilContainer);
});

$(function () {

  var BaseModel = function () {
    
    this.load = function () {return "Not implemented";};
  };
  
  var ModelContainer = {
    Model : {
      Article : function (thing) {
        this.load =function () {
          return "Overridden";
        };        
      } 
    }
  };

  ModelContainer.Model.Article.prototype = new BaseModel();
  
  $.extend(BlogApp, ModelContainer);
});
