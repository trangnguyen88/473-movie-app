var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/Movie');

// Create a movie schema
var movieSchema = mongoose.Schema({
    title: String,
    movie: JSON,
    meta: {
        votes: Number,
        likes: Number
    }
});

// Create a database collection model
var Movie = mongoose.model('Movie', movieSchema);

module.exports.Movie = Movie;