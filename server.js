var express = require('express'),
    http = require('http'),
    parser = require("body-parser"),
    mongoose = require("mongoose"),
    fs = require('fs'),
    request = require('request'),
    app;

//local variable
var listOfMovies;

//create our Express powered HTTP server
app = express();

app.use(express.static(__dirname + '/client'));

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

//Connect to mongodb database
mongoose.connect('mongodb://localhost/movie');

// Create a movie schema
// create a schema
var movieSchema = mongoose.Schema({
    title: String,
    movie: JSON,
    meta: {
        votes: Number,
        likes: Number
    }
})

// Create a database collection model
var Movie = mongoose.model('Movie', movieSchema);

// Remove the old movies in the collection
Movie.remove({}, function(err) {
    console.log('collection removed')
});



app.get('/', function(req, res) {
    res.send('This is the root route');
});

app.get('/movie', function(req, res) {

    //return all of the movies
    Movie.find(function(err, movies) {
        if (err) res.send("error");
        else {
            res.json(movies);
        }
    })
});

app.post('/movie/title/vote', function(req, res) {

    var vote = req.body.vote;
    var name = req.body.title;
    console.log('Stranger votes ' + vote + ' on ' + name);
    Movie.findOne({ title: name }, function(err, result) {
        if (err) {
            res.json({ 'result': 'error' });
            console.log("Error on accessing the database");
            return;
        }
        console.log(result);
        var newVotes = result.meta.votes + 1;
        var newLikes = result.meta.likes;
        if (vote == 'yes') {
            newLikes += 1;
        }

        Movie.update({ title: result.title }, { meta: { votes: newVotes, likes: newLikes } }, function(err, success) {

            if (err) {
                console.log("Error while updating database");
                res.json({ 'result': 'error' });
                return;
            }
            var reply = { 'result': 'success', 'newVotes': newVotes, 'newLikes': newLikes }
            res.json(reply);
        })
    })

});


app.listen(3000, function() {
    fs.readFile('movies.txt','utf8', function (err,fileData)
        {
            listOfMovies=fileData.replace(/\n/g, " ");
            listOfMovies=listOfMovies.replace(/\r/g, " ");
            listOfMovies=listOfMovies.split(', ');

            listOfMovies.forEach(function(name) {
                    request('http://www.omdbapi.com/?t=' + name + '&y=&plot=short&r=json', function(error, response, body) {
                    var info = JSON.parse(body);
                    console.log(info.Title);
                    var movie = new Movie({ title: info.Title, movie: info, meta: { votes: 0, likes: 0 } });
                    // Store the movie to the database
                    movie.save();
                });
            });
        });
        //set up our route
        console.log('server is listening on port 3000');
});
