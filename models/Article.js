//mongoose dependencies 
const mongoose = require("mongoose");

//save refrence to the schema constructor
const Schema = mongoose.Schema;

//creating new UserSchema object
const ArticleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	// `note` is an object that stores a Note id
	// The ref property links the ObjectId to the Note model
	// This allows us to populate the Article with an associated Note 
	note: {
		type: Schema.Types.objectId,
		ref: "Note"
	}
});


// Create the Article model with the ArticleSchema
const Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;