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
      /*
       * Returns the name of the current page
       * @return {String}
       */
      getPageName : function () {
        var htmlPatt, locs, loc;
        htmlPatt = /.*(?=.html)/i;
        locs = window.location.pathname.split("/");
        loc = locs[locs.length-1].match(htmlPatt);
        if (loc === null)
          return BlogApp.Util.PAGES.HOME;
        else
          return loc[0];
      },

      /*
       * Returns the current query string
       * @return {String}
       */
      getQueryString : function () {
        return window.location.href.split("?")[1];
      }
    }
  };

  $.extend(BlogApp, UtilContainer);
});
