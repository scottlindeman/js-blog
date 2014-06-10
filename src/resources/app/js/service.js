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
            var cat, c, i;
            cat = Parsers.parseQueryString().bacat;
            for (i=0;i<data.categories.length;i++) {
              c = data.categories[i];
              if (c.locationName === cat) {
                $("title").append(" | "+c.displayName);
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
       * Handles the directory response when called from the article page.
       * Launches the loadArticle process.
       * @namespace ResponseHandlers.Directory
       * @param {Object} opts
       * @return {Function}
       */
      articleDone : function (opts) {
        if (BlogApp.Util.getPageName() === BlogApp.Util.PAGES.ARTICLE) {
          return function (data, textStatus, jqXHR) {
            var queries, cat, art, c, i, j;
            queries = Parsers.parseQueryString();
            for (i=0;i<data.categories.length;i++) {
              c = data.categories[i];
              if (c.locationName === queries.bacat) {
                if (opts.maxArts > 0)
                  cat = BlogApp.Model.jsonToCategory(opts.maxArts)(c);
                else
                  cat = BlogApp.Model.jsonToCategory()(c);
                cat.renderSidebar();
                for (j=0;j<cat.articles.length;j++) {
                  art = cat.articles[j];
                  if (art.locationName === queries.baart) {
                    $("title").append(" | "+art.displayName);
                    break;
                  }
                  break;
                }
              }
            }
            BlogApp.Service.loadArticle($.extend(opts, queries));
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
    },

    Article : {
      /**
       * Handles the loading of an article response. Renders the article page.
       * @namespace ResponseHandlers.Article
       * @param {Object} opts
       * @return {Function}
       */
      articleDone : function (opts) {
        if (BlogApp.Util.getPageName() === BlogApp.Util.PAGES.ARTICLE) {
          return function (data, textStatus, jqXHR) {
            $(opts.renderAt).append(BlogApp.Converter.makeHtml(data));
            $(opts.renderAt).find("code").parent().addClass("prettyprint");
            window.prettyPrint && prettyPrint();

            $(opts.sidebar).height($(opts.contentWrapper).height()+40);

            function sidebarTweaks () {
              var sb = $(opts.sidebar), sbwidth = sb.width(),
                  cw = $(opts.contentWrapper), cwmarginleft = parseFloat(cw.css("margin-left"));
              if (sbwidth <= opts.sidebarWidth && sbwidth >= cwmarginleft)
                sb.css("border-right", "1px solid #ccc");
              else {
                sb.css("border-right", "none").width(cwmarginleft);
              }
            }
            sidebarTweaks();
            $(window).resize(sidebarTweaks);
          };
        }
        else
          return ResponseHandlers.noneFunc;
      }
    }
  };

  Parsers = {
    /**
     * Given an Object of options, makes sure that Object has all the
     * default options
     * @param {Object} opts
     * @param {Object} defaultOpts
     * @return {Object}
     */
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
    /**
     * Grabs the querystring from the current url and parses it into an object
     * @return {Object}
     */
    parseQueryString : function () {
      var params = {}, pairs, pair;
      pairs = BlogApp.Util.getQueryString().split("&");
      pairs.forEach(function (p, idx, arr) {
        pair = p.split("=");
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      });
      return params;
    },

    Directory : {
      /**
       * Creates the object of options for the Directory handler
       * @param {Object} opts
       * @return {Object}
       */
      parseOpts : function (opts) {
        return Parsers.base(opts, Parsers.Directory.defaultOpts);
      },
      
      defaultOpts : {
        maxCats : 0,
        maxArts : 0
      }
    },
    Article : {
      /**
       * Creates the object of options for the Article handler
       * @param {Object} opts
       * @return {Object}
       */
      parseOpts : function (opts) {
        Parsers.Article.defaultOpts.renderAt = BlogApp.Util.ARTICLERENDER;
        return Parsers.base(opts, Parsers.Article.defaultOpts);
      },

      defaultOpts : {
        bacat : "",
        baart : "",
        renderAt : "",
        sidebar : "#article-sidebar",
        sidebarWidth : 250,
        contentWrapper : ".article-content-wrapper"
      }
    }
  };
  
  ServiceContainer = {

    Service : {
      /**
       * Pulls the directory.json from the server and applies the proper
       * completion function
       * @namespace BlogApp.Service
       * @param {Object} opts
       */
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
          .done(ResponseHandlers.Directory.articleDone(opts))
          .fail(ResponseHandlers.Directory.fail(opts));
      },
      /**
       * Finds the correct article to display
       * @namespace BlogApp.Service
       * @param {Object} opts
       */
      loadArticle : function (opts) {
        opts = Parsers.Article.parseOpts(opts);
        $.ajax({
          url : BlogApp.Util.ARTICLEPATH+opts.bacat+"/"+opts.baart+".md",
          type : "GET",
          dataTaype : "text",
          cache : false
        })
          .done(ResponseHandlers.Article.articleDone(opts));
      },
      /**
       * The first function called on each page.
       * Loads the header and footer templates.
       * Begins reading the directory.json.
       * @namespace BlogApp.Service
       * @param {Object} opts
       *
       */
      initialize : function (opts) {
        BlogApp.Service.loadDirectory(opts);
        $("header.blog-header").load("/resources/app/templates/header.html");
        $("footer.blog-footer").load("/resources/app/templates/footer.html");
      }
    }
  };

  $.extend(BlogApp, ServiceContainer);
  
});
