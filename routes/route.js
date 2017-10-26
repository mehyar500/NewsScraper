// Import the  models
const models = require("../models");

module.exports = function(app) {
	app.get('/', function (req, res) {
      res.redirect('/articles');
    });

	app.get("/scrape", function(req, res) {
		// First, we grab the body of the html with request
		request("http://www.nytimes.com/", function(error, response, html) {
		    // Then, we load that into cheerio and save it to $ for a shorthand selector
		    let $ = cheerio.load(html);
		    // Make emptry array for temporarily saving and showing scraped Articles.
		    let scrapedArticles = {};
		    // Now, we grab every h2 within an article tag, and do the following:
		    $("article h2").each(function(i, element) {
		      // Save an empty result object
		      let result = {};
		      // Add the text and href of every link, and save them as properties of the result object
		      result.title = $(this).children("a").text();

		      console.log("What's the result title? " + result.title);
		      
		      result.link = $(this).children("a").attr("href");

		      scrapedArticles[i] = result;

		    });

		    console.log("Scraped Articles object: " + scrapedArticles);

		    let hbsArticleObject = {
		        articles: scrapedArticles
		    };

		    res.render("index", hbsArticleObject);

			});
	});

	// This will get the articles we scraped from the mongoDB
	app.get("/articles", function (req, res) {
    // Grab every doc in the Articles array
    Article
      .find({}, function (error, dbArticle) {
        // Log any errors
        if (error) {
          console.log(error// Or send the dbArticle to the browser as a json object
          );
        } else {
          res.render("index", {result: dbArticle});
        }
        //Will sort the articles by most recent (-1 = descending order)
      })
      .sort({'_id': -1});
	});

  // Grab an article by it's ObjectId
  app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the
    // matching one in our db...
    Article.findOne({"_id": req.params.id})
    // ..and populate all of the comments associated with it
      .populate("Note")
      .then(function (error, dbArticle) {
        // Log any errors
        if (error) {
          console.log(error// Otherwise, send the doc to the browser as a json object
          );
        } else {
          res.render("note", {result: dbArticle});
          // res.json (doc);
        }
      });
	});

	// Route for saving/updating an Article's associated Note
	app.post("/articles/:id", function(req, res) {
	  // Create a new note and pass the req.body to the entry
	  db.Note
	    .create(req.body)
	    .then(function(dbNote) {
	      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
	      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
	      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
	      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
	    })
	    .then(function(dbArticle) {
	      // If we were able to successfully update an Article, send it back to the client
	      res.json(dbArticle);
	    })
	    .catch(function(err) {
	      // If an error occurred, send it to the client
	      res.json(err);
	    });
	});


}
