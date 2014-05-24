$(function () {
  
  var UtilContainer = {
    Util : {
      DIRPATH : "/directory.json",
      ARTICLEPATH : "/resources/app/documents/",
      IMAGEPATH : "/resources/app/images/",
      ARTICLERENDER : "section#article-content",
      WINDOWSIZE : 4,
      SLIDERREPEAT : 7,
      PAGES : {
        ARTICLE : "article",
        CATEGORY : "category",
        HOME : "/"
      },

      getPageName : function () {
        var htmlPatt, loc;
        htmlPatt = /.*(?=.html)/i;
        loc = window.location.pathname.match(htmlPatt);
        if (loc === null)
          return BlogApp.Util.PAGES.HOME;
        else
          return loc[0].substring(1);
      },

      getQueryString : function () {
        return window.location.href.split("?")[1];
      }
    }
  };

  $.extend(BlogApp, UtilContainer);
});
