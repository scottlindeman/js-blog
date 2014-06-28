js-blog
=======

A frontend blog with blog posts can be categories and are written in markdown.

Installation
------------

To deploy a copy of this app to a server, download a zip of the latests release here: .

If you're using Apache or Nginx, place the contents of the zip into the respective www folder. Set up any Apache config as you see fit.

Structure
---------

Categories and articles are placed in the `resources/app/documents` folder. If this is the first install, you will see a sample category and article already in that folder.

In order for the categories and articles to be seen by the app, you must add them to the `directory.json` file. This file contains a simple mapping for categories and articles. Each category should have a `displayName`, a `locationName`, and a list of `articles`. Articles have a `displayName` and a `locationName`. In both cases, the `displayName` attribute tells the app that name that should be displayed on the page. The `locationName` attribute tells the app where to locate the category or article in the `resources/app/documents` folder.

    
