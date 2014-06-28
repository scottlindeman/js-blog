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

In order for the categories and articles to be seen by the app, you must add them to the `directory.json` file:

    {
        "categories" : [
            {
                "displayName"  : "Test Category 1",
                "locationName" : "test-category-1",
                "articles"     : [
                    {
                        "displayName"  : "Test Article 1",
                        "locationName" : "test-article-1"
                    },
                    {
                        "displayName"  : "Test Article 2",
                        "locationName" : "test-article-2"
                    },
                    {
                        "displayName"  : "Test Article 3",
                        "locationName" : "test-article-5"
                    },
                    {
                        "displayName"  : "Test Article 4",
                        "locationName" : "test-article-6"
                    }
                ]
            },
            {
                "displayName"  : "Test Category 2",
                "locationName" : "test-category-2",
                "articles"     : [
                    {
                        "displayName"  : "Test Article 1",
                        "locationName" : "test-article-3"
                    },
                    {
                        "displayName"  : "Test Article 2",
                        "locationName" : "test-article-4"
                    }
                ]
            }
        ]
    }

This file contains a simple mapping for categories and articles. Each category should have a `displayName`, a `locationName`, and a list of `articles`. Articles have a `displayName` and a `locationName`. In both cases, the `displayName` attribute tells the app that name that should be displayed on the page. The `locationName` attribute tells the app where to locate the category or article within the `resources/app/documents` folder. For categories, this is the name of the folder. For articles, this is the name of the markdown file.

    
