var BlogApp={};$(function(){if(typeof Showdown!=="undefined"){var a={Converter:new Showdown.converter()};$.extend(BlogApp,a)}});$(function(){var b,a;b={Model:{Article:function(c,d,f,e){this.displayName=c;this.locationName=d;this.catLocationName=f;this.description=e;this.Render.Condensed.elem="div";this.Render.Condensed.classes=["pull-left"];this.Render.Sidebar.at="ul.sidebar-articles";this.Render.Sidebar.elem="li";this.Render.Sidebar.classes=["baart"];this.imgSrc=BlogApp.Util.IMAGEPATH+"default.png";this.modelType="baart";this.linkPage="article.html"},Category:function(c,d,f,e){this.displayName=c;this.locationName=d;this.description=f;this.articles=e;this.Render.Condensed.at="section.categories";this.Render.Condensed.elem="article";this.Render.Condensed.classes=["well","well-lg"];this.Render.Page.at="div.category";this.Render.Page.elem="section";this.Render.Page.classes=["container"];this.Render.Sidebar.at="div.sidebar";this.Render.Sidebar.elem="h3";this.Render.Sidebar.classes=["bacat"];this.modelType="bacat";this.linkPage="category.html"},jsonToArticle:function(c){return function(f,e,d){return new BlogApp.Model.Article(f.displayName,f.locationName,c,f.description)}},jsonToCategory:function(c){return function(f,e,d){var g=f.articles;if(c!==undefined&&c>0){g=g.slice(0,c)}return new BlogApp.Model.Category(f.displayName,f.locationName,f.description,g.map(BlogApp.Model.jsonToArticle(f.locationName)))}},setupArticleHover:function(){var f,c=15,g=3;function h(l,j){var k=l.find("div.initial-arts").children(),i=-(k.length*(k.width()+20))*BlogApp.Util.SLIDERREPEAT;if(!(j>0&&parseFloat(l.css("margin-left"))>=0)&&!(j<0&&parseFloat(l.css("margin-left"))<=i)){l.animate({"margin-left":"+="+j+"px"},10)}}function e(){f&&window.clearInterval(f)}function d(k,j){var i=k.parent().find("div.scroll");if(i.find("div.initial-arts").children().length>=BlogApp.Util.WINDOWSIZE){f=window.setInterval(function(){h(i,j)},c)}}$("div.browse.pull-right").hover(function(){d($(this),-g)},e);$("div.browse.pull-left").hover(function(){d($(this),g)},e)}}};a=function(){this.displayName="No Display Name";this.locationName="no-location-name";this.description="description";this.scrubKeywords=["_pre_","_post_"];this.Render={Page:{at:"",elem:"",classes:[]},Condensed:{at:"",elem:"",classes:[]},Sidebar:{at:"",elem:"",classes:[]}}};a.prototype.id=function(c){var d=this.modelType+"-"+this.locationName;if(c===undefined||c===false){return d}else{return"#"+d}};a.prototype.scrubbedLocationName=function(){var c=this.locationName,d;for(d=0;d<this.scrubKeywords.length;d++){c=c.replace(this.scrubKeywords[d],"")}return c};a.prototype.$this=function(){return $(this.id(true))};a.prototype.elemTag=function(c){return"<"+c+" id='"+this.id()+"' class='"+this.modelType+"' >"};a.prototype.closeElemTag=function(c){return"</"+c+">"};a.prototype.addClasses=function(c){c.forEach(function(f,e,d){this.$this().addClass(f)},this)};a.prototype.createLink=function(d,e){var c="<a href='"+this.linkPage;c+="?"+$.param(d);c+="' >"+e+"</a>";return c};b.Model.Article.prototype=new a();b.Model.Article.prototype.renderCondensed=function(c){var d=this.elemTag(this.Render.Condensed.elem);d+=this.createLink({bacat:this.catLocationName,baart:this.scrubbedLocationName()},"<img src='"+this.imgSrc+"' width='200' height='200' />");d+="<div class='baart-info'>";d+=this.createLink({bacat:this.catLocationName,baart:this.scrubbedLocationName()},"<h5>"+this.displayName+"</h5>");d+="</div>";d+=this.closeElemTag(this.Render.Condensed.elem);$(c).append(d);this.addClasses(this.Render.Condensed.classes)};b.Model.Article.prototype.renderSidebar=function(){var c=this.elemTag(this.Render.Sidebar.elem);c+=this.createLink({bacat:this.catLocationName,baart:this.scrubbedLocationName()},this.displayName);c+=this.closeElemTag(this.Render.Sidebar.elem);$(this.Render.Sidebar.at).append(c);this.addClasses(this.Render.Condensed.classes)};b.Model.Category.prototype=new a();b.Model.Category.prototype.renderCondensed=function(){var c;c=this.elemTag(this.Render.Condensed.elem);c+="<h3>"+this.createLink({bacat:this.locationName},this.displayName)+"</h3>";c+="<div class='browse pull-left glyphicon glyphicon-chevron-left' />";c+="<div class='articles'><div class='scroll'><div class='initial-arts' /></div></div>";c+="<div class='browse pull-right glyphicon glyphicon-chevron-right' />";c+=this.closeElemTag(this.Render.Condensed.elem);$(this.Render.Condensed.at).append(c);this.renderCondensedArticles();this.addClasses(this.Render.Condensed.classes)};b.Model.Category.prototype.renderCondensedArticles=function(){this.articles.forEach(function(h,g,f){h.renderCondensed(this.id(true)+" div.articles div.scroll div.initial-arts")},this);if(this.articles.length>=BlogApp.Util.WINDOWSIZE){var c=this.$this().find("div.articles div.scroll div.initial-arts"),d,e;d="<div class='baart empty-baart pull-left'><div class='art-divider'/></div>";c.append(d);for(e=0;e<BlogApp.Util.SLIDERREPEAT;e++){c.parent().append("<div class='copied-arts'>"+c.html()+"</div>")}}};b.Model.Category.prototype.renderPage=function(){var c=this.elemTag(this.Render.Page.elem);c+="<div class='page-header'><h1>"+this.displayName+"</h1></div>";c+=this.closeElemTag(this.Render.Page.elem);$(this.Render.Page.at).append(c);this.articles.forEach(function(f,e,d){f.renderCondensed(this.id(true))},this);this.addClasses(this.Render.Page.classes)};b.Model.Category.prototype.renderSidebar=function(){var c=this.elemTag(this.Render.Sidebar.elem);c+=this.createLink({bacat:this.locationName},this.displayName);c+=this.closeElemTag(this.Render.Sidebar.elem);c+="<ul class='sidebar-articles' />";$(this.Render.Sidebar.at).append(c);this.articles.forEach(function(f,e,d){f.renderSidebar()});this.addClasses(this.Render.Sidebar.classes)};$.extend(BlogApp,b)});$(function(){var a,c,b;c={noneFunc:function(){},Directory:{mainDone:function(d){if(BlogApp.Util.getPageName()===BlogApp.Util.PAGES.HOME){return function(g,h,f){var e=g.categories;if(d.maxCats>0){e=e.slice(0,d.maxCats)}if(d.maxArts>0){e=e.map(BlogApp.Model.jsonToCategory(d.maxArts))}else{e=e.map(BlogApp.Model.jsonToCategory())}e.forEach(function(k,j,i){k.renderCondensed()});BlogApp.Model.setupArticleHover()}}else{return c.noneFunc}},categoryDone:function(d){if(BlogApp.Util.getPageName()===BlogApp.Util.PAGES.CATEGORY){return function(h,k,g){var e,j,f;e=b.parseQueryString().bacat;for(f=0;f<h.categories.length;f++){j=h.categories[f];if(j.locationName===e){$("title").append(" | "+j.displayName);if(d.maxArts>0){BlogApp.Model.jsonToCategory(d.maxArts)(j).renderPage()}else{BlogApp.Model.jsonToCategory()(j).renderPage()}break}}}}else{return c.noneFunc}},articleDone:function(d){if(BlogApp.Util.getPageName()===BlogApp.Util.PAGES.ARTICLE){return function(h,e,o){var l,n,g,m,k,f;l=b.parseQueryString();for(k=0;k<h.categories.length;k++){m=h.categories[k];if(m.locationName===l.bacat){if(d.maxArts>0){n=BlogApp.Model.jsonToCategory(d.maxArts)(m)}else{n=BlogApp.Model.jsonToCategory()(m)}n.renderSidebar();for(f=0;f<n.articles.length;f++){g=n.articles[f];if(g.locationName===l.baart){$("title").append(" | "+g.displayName);break}break}}}BlogApp.Service.loadArticle($.extend(d,l))}}else{return c.noneFunc}},fail:function(d){return function(e,g,f){console.error(f)}}},Article:{articleDone:function(d){if(BlogApp.Util.getPageName()===BlogApp.Util.PAGES.ARTICLE){return function(f,h,e){$(d.renderAt).append(BlogApp.Converter.makeHtml(f));$(d.renderAt).find("code").parent().addClass("prettyprint");window.prettyPrint&&prettyPrint();$(d.sidebar).height($(d.contentWrapper).height()+40);function g(){var l=$(d.sidebar),k=l.width(),j=$(d.contentWrapper),i=parseFloat(j.css("margin-left"));if(k<=d.sidebarWidth&&k>=i){l.css("border-right","1px solid #ccc")}else{l.css("border-right","none").width(i)}}g();$(window).resize(g)}}else{return c.noneFunc}}}};b={base:function(f,d){f=f||{};var e={};for(key in d){if(f[key]!==undefined){e[key]=f[key]}else{e[key]=d[key]}}return e},parseQueryString:function(){var f={},d,e;d=BlogApp.Util.getQueryString().split("&");d.forEach(function(i,h,g){e=i.split("=");f[decodeURIComponent(e[0])]=decodeURIComponent(e[1])});return f},Directory:{parseOpts:function(d){return b.base(d,b.Directory.defaultOpts)},defaultOpts:{maxCats:0,maxArts:0}},Article:{parseOpts:function(d){b.Article.defaultOpts.renderAt=BlogApp.Util.ARTICLERENDER;return b.base(d,b.Article.defaultOpts)},defaultOpts:{bacat:"",baart:"",renderAt:"",sidebar:"#article-sidebar",sidebarWidth:250,contentWrapper:".article-content-wrapper"}}};a={Service:{loadDirectory:function(d){d=b.Directory.parseOpts(d);$.ajax({url:BlogApp.Util.DIRPATH,type:"GET",dataType:"json",cache:false}).done(c.Directory.mainDone(d)).done(c.Directory.categoryDone(d)).done(c.Directory.articleDone(d)).fail(c.Directory.fail(d))},loadArticle:function(d){d=b.Article.parseOpts(d);$.ajax({url:BlogApp.Util.ARTICLEPATH+d.bacat+"/"+d.baart+".md",type:"GET",dataTaype:"text",cache:false}).done(c.Article.articleDone(d))},initialize:function(d){BlogApp.Service.loadDirectory(d);$("header.blog-header").load("/resources/app/templates/header.html");$("footer.blog-footer").load("/resources/app/templates/footer.html")}}};$.extend(BlogApp,a)});$(function(){var a={Util:{DIRPATH:"/js-blog/directory.json",ARTICLEPATH:"/js-blog/resources/app/documents/",IMAGEPATH:"/js-blog/resources/app/images/",ARTICLERENDER:"section#article-content",WINDOWSIZE:4,SLIDERREPEAT:7,PAGES:{ARTICLE:"article",CATEGORY:"category",HOME:"/"},getPageName:function(){var b,c;b=/.*(?=.html)/i;c=window.location.pathname.match(b);if(c===null){return BlogApp.Util.PAGES.HOME}else{return c[0].substring(1)}},getQueryString:function(){return window.location.href.split("?")[1]}}};$.extend(BlogApp,a)});
