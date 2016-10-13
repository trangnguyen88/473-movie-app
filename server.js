var express = require('express'),
    http = require('http'),
    parser = require("body-parser"),
    mongoose = require("mongoose"),
    app;

//create our Express powered HTTP server
app = express();

app.use(express.static(__dirname + '/client'));

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

//Connect to mongodb database 
mongoose.connect('mongodb://localhost/Movie');

// Create a movie schema
// create a schema
var movieSchema = mongoose.Schema({
    title: String,
    photo: String,
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

// Create some movies to store to the database
var FightClub = new Movie({ title: 'Fight Club', photo: './img/0.jpg', meta: { votes: 0, likes: 0 } });

var TheForceAwakens = new Movie({ title: 'The Force Awakens', photo: './img/1.jpg', meta: { votes: 0, likes: 0 } });

var TheDarkKnight = new Movie({ title: 'The Dark Knight', photo: './img/2.jpg', meta: { votes: 0, likes: 0 } });

var HarryPotter = new Movie({ title: 'Harry Potter And The Order Of The Phoenix', photo: './img/3.jpg', meta: { votes: 0, likes: 0 } });

var SuperBad = new Movie({ title: 'SuperBad', photo: './img/4.jpg', meta: { votes: 0, likes: 0 } });

var Scott = new Movie({ title: 'Scott Pilgrim Vs The World', photo: './img/5.jpg', meta: { votes: 0, likes: 0 } });

var DeadPool = new Movie({ title: 'DeadPool', photo: './img/6.jpg', meta: { votes: 0, likes: 0 } });

var Mermaid = new Movie({ title: 'The Little Mermaid', photo: './img/7.jpg', meta: { votes: 0, likes: 0 } });

var Joker = new Movie({ title: 'Suicide Squad', photo: './img/8.jpg', meta: { votes: 0, likes: 0 } });

// Store the movie to the database
FightClub.save();
TheForceAwakens.save();
TheDarkKnight.save();
HarryPotter.save();
SuperBad.save();
Scott.save();
DeadPool.save();
Mermaid.save();
Joker.save();

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


http.createServer(app).listen(3000);
//set up our routes
console.log('server is listening on port 3000');