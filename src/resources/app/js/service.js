$(function () {

  var ServiceContainer, ResponseHandlers, Parsers;

  ResponseHandlers = {
    noneFunc : function () {},
    
    Directory : {
      
      /**
       * Handles the directory response when called from the main page
       * @namespace ResponseHandlers.Directory
       * @param {Object} opts
       * @return {Function}
       */
      mainDone : function (opts) {
        if (BlogApp.Util.getPageName() === BlogApp.Util.PAGES.HOME) {
          return function (data, textStatus, jqXHR) {
            var cats = data.categories;
            
            if (opts.maxCats > 0)
              cats = cats.slice(0,opts.maxCats);
            
            if (opts.maxArts > 0)
              cats = cats.map(BlogApp.Model.jsonToCategory(opts.maxArts));
            else
              cats = cats.map(BlogApp.Model.jsonToCategory());
          
            cats.forEach(function (c, idx, arr) {
              c.renderCondensed();
            });
            BlogApp.Model.setupArticleHover();
          };
        }
        else
          return ResponseHandlers.noneFunc;
      },

      /**
       * Handles the directory response when called from the category page
       * @namespace ResponseHandlers.Directory
       * @param {Object} opts
       * @return {Function}
       */
      categoryDone : function (opts) {
        if (BlogApp.Util.getPageName() === BlogApp.Util.PAGES.CATEGORY) {
          return function (data, textStatus, jqXHR) {
            var cat = Parsers.Directory.parseQueryString();
            console.log(cat);
            for (var i=0;i<data.categories.length;i++) {
              var c = data.categories[i];
              if (c.locationName === cat.bacat) {
                if (opts.maxArts > 0)
                  BlogApp.Model.jsonToCategory(opts.maxArts)(c).renderPage();
                else
                  BlogApp.Model.jsonToCategory()(c).renderPage();
                break;
              }
            }
          };
        }
        else
          return ResponseHandlers.noneFunc;
      },
      
      /**
       * Handles the directory response on fail
       * @namespace ResponseHandlers.Directory
       * @param {Object} opts
       * @return {Function}
       */
      fail : function (opts) {
        return function(jqXHR, textStatus, errorThrown) {
          console.error(errorThrown);
        };
      }
    }
  };

  Parsers = {
    base : function (opts, defaultOpts) {
      opts = opts || {};
      var returnOpts = {};
      for (key in defaultOpts) {
        if (opts[key] !== undefined)
          returnOpts[key] = opts[key];
        else
          returnOpts[key] = defaultOpts[key];
      }
      return returnOpts;
    },

    Directory : {
      parseOpts : function(opts) {
        return Parsers.base(opts, Parsers.Directory.defaultOpts);
      },
      
      defaultOpts : {
        maxCats : 0,
        maxArts : 0
      },

      parseQueryString : function () {
        var params = {}, pairs;
        pairs = BlogApp.Util.getQueryString().split("&");
        pairs.forEach(function (p, idx, arr) {
          var pair = p.split("=");
          params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        });
        return params;
      }
    }
  };
  
  ServiceContainer = {

    Service : {

      loadDirectory : function (opts) {
        opts = Parsers.Directory.parseOpts(opts);
        $.ajax({
          url : BlogApp.Util.DIRPATH,
          type : "GET",
          dataType : "json",
          cache : false
        })
          .done(ResponseHandlers.Directory.mainDone(opts))
          .done(ResponseHandlers.Directory.categoryDone(opts))
          .fail(ResponseHandlers.Directory.fail(opts));
      }
      
    }
    
  };

  $.extend(BlogApp, ServiceContainer);
  
});
