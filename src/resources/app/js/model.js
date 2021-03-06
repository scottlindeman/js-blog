$(function () {

  var ModelContainer, BaseModel;
  
  ModelContainer = {
    
    Model : {
      /**
       * Initial delcaration of Article class.
       * @namespace BlogApp.Model
       * @param {String} displayName
       * @param {String} locationName
       * @param {String} catLocationName
       * @param {String} description
       */

      Article : function (displayName, locationName, catLocationName, description) {
        this.displayName = displayName;
        this.locationName = locationName;
        this.catLocationName = catLocationName;
        this.description = description;
        this.Render.Condensed.elem = "div";
        this.Render.Condensed.classes = ["pull-left"];
        this.Render.Sidebar.at = "ul.sidebar-articles";
        this.Render.Sidebar.elem = "li";
        this.Render.Sidebar.classes = ["baart"];
        this.imgSrc = BlogApp.Util.IMAGEPATH+locationName+".png";
        this.modelType = "baart";
        this.linkPage = "article.html";
      },

      /**
       * Initial declaration of Category class
       * @namespace BlogApp.Model
       * @param {String} displayName
       * @param {String} locationName
       * @param {String} description
       * @param {Array} articles
       */
      Category : function (displayName, locationName, description, articles) {
        this.displayName = displayName;
        this.locationName = locationName;
        this.description= description;
        this.articles = articles;
        this.Render.Condensed.at = "section.categories";
        this.Render.Condensed.elem = "article";
        this.Render.Condensed.classes = ["well", "well-lg"];
        this.Render.Page.at = "div.category";
        this.Render.Page.elem = "section";
        this.Render.Page.classes = ["container"];
        this.Render.Sidebar.at = "div.sidebar";
        this.Render.Sidebar.elem = "h3";
        this.Render.Sidebar.classes = ["bacat"];
        this.modelType = "bacat";
        this.linkPage = "category.html";
      },

      /**
       * Converts a json representation of an Article to an Article object
       * @namespace BlogApp.Model
       * @param {Object} jsonArticle
       * @param {int} idx
       * @param {Array} arr
       * @return {BlogApp.Model.Article}
       */
      jsonToArticle : function (catLocationName) {
        return function (jsonArticle, idx, arr) {
          return new BlogApp.Model.Article(jsonArticle.displayName,
                                         jsonArticle.locationName,
                                         catLocationName,
                                         jsonArticle.description);
        };
      },

      /**
       * Converts a json representation of a Category to a Category object
       * @namespace BlogApp.Model
       * @param {Object} jsonCategory
       * @param {int} idx
       * @param {Array} arr
       * @return {BlogApp.Model.Category}
       */
      jsonToCategory : function (maxArt) {
        return function (jsonCategory, idx, arr) {
          var arts = jsonCategory.articles;
          if (maxArt !== undefined && maxArt > 0)
            arts = arts.slice(0, maxArt);
          return new BlogApp.Model.Category(jsonCategory.displayName,
                                            jsonCategory.locationName,
                                            jsonCategory.description,
                                            arts.map(BlogApp.Model.jsonToArticle(jsonCategory.locationName)));
        };
      },
      /**
       * Attaches the "infinite" scrolling hover events to the arrow buttons
       * on the index page.
       */
      setupArticleHover : function () {
        var scrollInterval, scrollIntervalLength = 15, scrollSpeed = 3;;

        function performArticleAnimation (scrollArea, increment) {
          var children = scrollArea.find("div.initial-arts").children(),
              totalWidth = -(children.length * (children.width() + 20)) * BlogApp.Util.SLIDERREPEAT;
          if (!(increment > 0 && parseFloat(scrollArea.css("margin-left")) >= 0) &&
              !(increment < 0 && parseFloat(scrollArea.css("margin-left")) <= totalWidth))
            scrollArea.animate({"margin-left" : "+="+increment+"px"}, 10);
        }

        function stopAnimation () {
          scrollInterval && window.clearInterval(scrollInterval);
        }

        function startAnimation (browseButton, increment) {
          var scroll = browseButton.parent().find("div.scroll");
          if (scroll.find("div.initial-arts").children().length >= BlogApp.Util.WINDOWSIZE) {
            scrollInterval = window.setInterval(function () {
              performArticleAnimation(scroll, increment);
            }, scrollIntervalLength);
          }
        }
        
        $("div.browse.pull-right").hover(
          function () {
            startAnimation($(this), -scrollSpeed);
          },
          stopAnimation);
        
        $("div.browse.pull-left").hover(
          function () {
            startAnimation($(this), scrollSpeed);
          },
          stopAnimation);
      },

      /**
       * Attaches an onerror function to article images
       */
      setupArticleImageError : function () {
        $("div.baart img").error(function () {
          $(this).attr("src", BlogApp.Util.IMAGEPATH+"default.png");
        });
      }
    }
  };
  
  /*****************************************************************************
   * BASEMODEL CLASS METHOD DEFINITIONS
   ****************************************************************************/
  BaseModel = function () {
    this.displayName = "No Display Name";
    this.locationName = "no-location-name";
    this.description = "description";
    this.scrubKeywords = ["_pre_", "_post_"];
    this.Render = {
      Page : {
        at : "",
        elem : "",
        classes : []
      },
      Condensed : {
        at : "",
        elem : "",
        classes : []
      },
      Sidebar : {
        at : "",
        elem : "",
        classes : []
      }
    };
  };

  /**
   * Creates the unique id of this BaseModel
   * If given true, returns selector ready id.
   * @namespace BaseModel
   * @param {bool} hash
   * @return {String}
   */
  BaseModel.prototype.id = function (hash) {
    var id = this.modelType+"-"+this.locationName;
    if (hash === undefined || hash === false)
      return id;
    else
      return "#"+id;
  };

  /**
   * Removes certain keywords from the locationName
   * for use when linking.
   * @return {String}
   */
  BaseModel.prototype.scrubbedLocationName = function () {
    var newLocationName=this.locationName, i;
    for (i=0;i<this.scrubKeywords.length;i++) {
      newLocationName = newLocationName.replace(this.scrubKeywords[i], "");
    }
    return newLocationName;
  };

  /**
   * Finds the jQuery object of this BaseModel
   * @namespace BaseModel
   * @return {jQuery Object}
   */  
  BaseModel.prototype.$this = function () {
    return $(this.id(true));
  };

  /**
   * Given the tag to make, creates tag
   * @namespace BaseModel
   * @param {String} elem
   * @return {String}
   */
  BaseModel.prototype.elemTag = function (elem) {
    return "<"+elem+" id='"+this.id()+"' class='"+this.modelType+"' >";
  };

  /**
   * Given the closing tag to make, creates tag
   * @namespace BaseModel
   * @param {String} elem
   * @return {String}
   */
  BaseModel.prototype.closeElemTag = function (elem) {
    return "</"+elem+">";
  };

  /**
   * Adds the given classes to this BaseModel's jQuery Object
   * @namespace BaseModel
   * @param {Array} classes
   */
  BaseModel.prototype.addClasses = function (classes) {
    classes.forEach(function (c, idx, arr) {
      this.$this().addClass(c);
    }, this);
  };

  /**
   * Creates the a tag for this BaseModel
   * @namespace BaseModel
   * @param {Object} queries
   * @param {String} text
   * @return {String}
   */
  BaseModel.prototype.createLink = function (queries, text) {
    var aTag = "<a href='"+this.linkPage;
    aTag += "?"+$.param(queries);
    aTag += "' >"+text+"</a>";
    return aTag;
  };

  /*****************************************************************************
   * ARTICLE CLASS METHOD DEFINITIONS
   ****************************************************************************/
  ModelContainer.Model.Article.prototype = new BaseModel();

  /**
   * Renders the condensed version of this Article
   * @namespace BlogApp.Model.Article
   * @param {String} bacat
   */
  ModelContainer.Model.Article.prototype.renderCondensed = function (bacat) {
    var baart = this.elemTag(this.Render.Condensed.elem);
    baart += this.createLink({bacat : this.catLocationName, baart : this.scrubbedLocationName()},
                             "<img src='"+this.imgSrc+"' width='200' height='200' />");
    console.log(this.imgSrc);
    baart += "<div class='baart-info'>";
    baart += this.createLink({bacat : this.catLocationName, baart : this.scrubbedLocationName()},
                             "<h5>"+this.displayName+"</h5>");
    baart += "</div>";
    baart += this.closeElemTag(this.Render.Condensed.elem);
    $(bacat).append(baart);
    this.addClasses(this.Render.Condensed.classes);
  };

  /**
   * Renders the sidebar version of this Article
   * @namespace BlogApp.Model.Article
   */
  ModelContainer.Model.Article.prototype.renderSidebar = function () {
    var baart = this.elemTag(this.Render.Sidebar.elem);
    baart += this.createLink({bacat : this.catLocationName, baart : this.scrubbedLocationName()},
                            this.displayName);
    baart += this.closeElemTag(this.Render.Sidebar.elem);
    $(this.Render.Sidebar.at).append(baart);
    this.addClasses(this.Render.Condensed.classes);
  };

  /*****************************************************************************
   * CATEGORY CLASS METHOD DEFINITIONS
   ****************************************************************************/
  ModelContainer.Model.Category.prototype = new BaseModel();

  /**
   * Renders the condensed version of this Category
   * @namespace BlogApp.Model.Category
   */
  ModelContainer.Model.Category.prototype.renderCondensed = function () {
    var bacat;
    bacat = this.elemTag(this.Render.Condensed.elem);
    bacat += "<h3>"+this.createLink({bacat : this.locationName},
                                    this.displayName)+"</h3>";
    bacat += "<div class='browse pull-left glyphicon glyphicon-chevron-left' />";
    bacat += "<div class='articles'><div class='scroll'><div class='initial-arts' /></div></div>";
    bacat += "<div class='browse pull-right glyphicon glyphicon-chevron-right' />";
    bacat += this.closeElemTag(this.Render.Condensed.elem);
    
    $(this.Render.Condensed.at).append(bacat);
    this.renderCondensedArticles();
    this.addClasses(this.Render.Condensed.classes);
  };

  /**
   * Renders the condensed articles to display properly in the slider
   * @namespace BlogApp.Model.Category
   */
  ModelContainer.Model.Category.prototype.renderCondensedArticles = function () {
    this.articles.forEach(function(baart, idx, arr) {
      baart.renderCondensed(this.id(true)+" div.articles div.scroll div.initial-arts");
    }, this);

    if (this.articles.length >= BlogApp.Util.WINDOWSIZE) {
      var cat = this.$this().find("div.articles div.scroll div.initial-arts"), emptyArt, i;
      emptyArt = "<div class='baart empty-baart pull-left'><div class='art-divider'/></div>";
      cat.append(emptyArt);
      for (i=0;i<BlogApp.Util.SLIDERREPEAT;i++) {
        cat.parent().append("<div class='copied-arts'>"+cat.html()+"</div>");
      }
    }
  };

  /**
   * Renders the page version of this category
   * @namespace BlogApp.Model.Category
   */
  ModelContainer.Model.Category.prototype.renderPage = function () {
    
    var bacat = this.elemTag(this.Render.Page.elem);
    bacat += "<div class='page-header'><h1>"+this.displayName+"</h1></div>";
    bacat += this.closeElemTag(this.Render.Page.elem);
    
    $(this.Render.Page.at).append(bacat);

    this.articles.forEach(function (baart, idx, arr) {
      baart.renderCondensed(this.id(true));
    }, this);
    this.addClasses(this.Render.Page.classes);
  };

  /**
   * Renders the sidebar version of this category
   * @namespace BlogApp.Model.Category
   */
  ModelContainer.Model.Category.prototype.renderSidebar = function () {
    var bacat = this.elemTag(this.Render.Sidebar.elem);
    bacat += this.createLink({bacat : this.locationName},
                             this.displayName);
    bacat += this.closeElemTag(this.Render.Sidebar.elem);
    bacat += "<ul class='sidebar-articles' />";
    $(this.Render.Sidebar.at).append(bacat);
    this.articles.forEach(function (baart, idx, arr) {
      baart.renderSidebar();
    });
    this.addClasses(this.Render.Sidebar.classes);
  };
  
  $.extend(BlogApp, ModelContainer);
});
