$(function () {

  var ServiceContainer, ResponseHandlers, Parsers;

  ResponseHandlers = {
    Directory : {
      done : function (opts) {
        return function(data, textStatus, jqXHR) {
          var cats = data.categories.map(BlogApp.Model.jsonToCategory);
          if (opts.maxCats > 0)
            cats = cats.slic(0,opts.maxCats);
          if (opts.maxArts > 0) {
            cats.forEach(function (c, idx, arr) {
              c.articles = c.articles.slice(0,opts.maxArts);
            });
          }
          cats.forEach(function (c, idx, arr) {
            c.renderCondensed();
          });
        };
      },
      fail : function (opts) {
        return function(jqXHR, textStatus, errorThrown) {};
      }
    }
  };

  Parsers = {
    base : function (opts, defaultOpts) {
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
      }
    }
  };
  
  ServiceContainer = {

    Service : {

      loadDirectory : function (opts) {
        opts = opts || {};
        opts = Parsers.Directory.parseOpts(opts);
        $.ajax({
          url : BlogApp.Util.DIRPATH,
          type : "GET",
          dataType : "json",
          cache : false
        })
          .done(ResponseHandlers.Directory.done(opts))
          .fail(ResponseHandlers.Directory.fail(opts));
      }
      
    }
    
  };

  $.extend(BlogApp, ServiceContainer);
  
});
