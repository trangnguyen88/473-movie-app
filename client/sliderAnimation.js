var Movies = [];

var main = function() {
    retrieveMovies();
}


var retrieveMovies = function() {
    $.get('/movie', function(result) {
        Movies = result;
        displayMovies(Movies);
    });
}

var displayMovies = function(movies) {
    var step = 3,
        start = 0,
        end = step,
        total = movies.length;
    //step=(total)%4;
    var indexes = [start, end];
    var arrayOfItems = [];
    var i = 0;
    //generate all movies and put in arrayOfItems
    for (i; i < total; i++) {
        var $element = newItem(movies[i]);
        arrayOfItems.push($element);
    }

    //put all elements in array
    generateMore(indexes, arrayOfItems, movies);
    $("#left-bttn.massive.ui.button").hide();  //Lets disable the left button as we are starting from first 3 elements

    $("#left-bttn").on("click", function() {
    
        end = start;
	start = start - step;
        
        if(start >= 0){
            generateMore([start, end], arrayOfItems, movies);
	}
        
        if(start == 0){
            $("#left-bttn.massive.ui.button").hide();
        }
        if(start >= step){
            $("#right-bttn.massive.ui.button").show();
        }
        

    });
    $("#right-bttn").on("click", function() {
       
        start = start + step;
        end = start + step;
        if(end <= total){
           generateMore([start, end], arrayOfItems, movies);
        }
        if(end >= total) {
            $("#right-bttn.massive.ui.button").hide();
        }
        if(start >= step){
            $("#left-bttn.massive.ui.button").show();
        }
    });

}

var generateMore = function(indexes, arrayOfItems, movies) {
    var numberOfSquaresToShow = indexes[1];
    var i = indexes[0];
    var $container = $("body .ui.grid .twelve.wide.column .movie-container .ui.grid");
    var $img = $('body .twelve.wide.column .movie-container .ui.grid .five.wide.column .ui.card .image img');
    $($container).empty();
    for (i; i < numberOfSquaresToShow; ++i) {
        $container.append(arrayOfItems[i]);
    }

    //Pop Up style
    $(arrayOfItems).each(function(index) {

        //Remove click eventhandlers if they are set before to prevent duplication
        $(this).find('.image').unbind('click');
        $(this).find('.ui .green').unbind('click');
        $(this).find('.ui .red').unbind('click');

        //Add click eventhandler back
        $(this).find('.image').on('click', function() {
            $('.ui.modal').each(function() {
                $(this).remove();
            });
            appendmodal(movies[index].movie);

        });

        $(this).find('.ui .green').on('click', function() {

            var input = { vote: "yes", title: movies[index].title };
            sendVoteToServer(input, index, this.closest('.extra'));
	    $(this).find('.ui .green').context.disabled = true;//disallow user to double click
        })

        $(this).find('.ui .red').on('click', function() {
            var input = { vote: "no", title: movies[index].title };
            sendVoteToServer(input, index, this.closest('.extra'));
            $(this).find('.ui .red').context.disabled = true;//disallow user to double click
            
        })
    });

}

var sendVoteToServer = function(input, index, parentNode, node) {
    $.post('/movie/title/vote', input, function(res) {
        var $temp = node.next();

        if (res.result == 'success') {
            //update votes on the movie
            Movies[index].meta.votes = res.newVotes;
            Movies[index].meta.likes = res.newLikes;
            var progressBar = (res.newLikes / res.newVotes) * 100;
            //Update rating
            $(parentNode).find('.rating').text('Likes: ' + res.newLikes + ' / Total Votes: ' + res.newVotes);
            //Update the width of progress bar
            var $temp1 = $temp.children();

            $temp1.width(progressBar + '%');

            var $temp2 = $temp1.children();
            $temp2.text(parseInt(progressBar) + '%');
            updateVotes(Movies[index], Movies[index].meta.votes);
            updateProgessbar(Movies[index],(Movies[index].meta.likes/Movies[index].meta.votes)*100);
        }
    })
}

var newItem = function(object) {
    //    $photo = Movies[i].photo;
    var item;
    var $id;
    var votes = object.meta.votes;
    var likes= object.meta.likes;
    var $progress; // = parseInt(object.meta.likes/object.meta.votes*100);
    if (likes == 0 && votes == 0)
        $progress = 0;
    else
        $progress = parseInt(likes / votes * 100);
    $item = $('<div class="five wide column">' +
        '<div class="ui card"id="' + object.movie.Title + '">' +
        '<div class="ui center aligned segment">' + object.movie.Title + '</div>' // title
        +
        '<div class="image">' +
        '<img src=' + object.movie.Poster + ' >' +
        '</div>' +
        '<div class="extra center aligned content">' +
        '<div class="ui two attached buttons">' +
        '<button class="ui green button"><i class="chevron up icon"></i></button>' +
        '<div class="or"> </div>' +
        '<button class="ui red button"><i class="chevron down icon"></i></button>' +
        '</div>' +
        '<div class="ui statistic" >' +
        '<div class="label">' +
        'Votes' + '</div>' +
        '<div class="value" >' + votes + '</div></div>' +
        '<div class="ui tiny progress"  data-percent = ' + $progress + '>' +
        '<div class="bar" style = "transition-duration : 300ms;  width : ' + $progress + '%">' +
        '</div>' +
        '</div>' +
        '</div></div></div>');
    return $item;
}
var updateVotes = function(object, votes)
{
    var $field = $("div[id='" + object.movie.Title + "'] .ui.statistic");
    var $oldVote = $("div[id='" + object.movie.Title + "'] .value");
    var $updateTotal = '<div class="value" >' + votes + '</div></div>'

    $('<div class="value" id="' + object.movie.Title + ' " >'); //+votes +'</div>') ;
    $oldVote.remove();
    $($field).append($updateTotal);

}
var updateProgessbar= function (object, avg)
{
    var $field = $("div[id='" + object.movie.Title + "'] .extra.center.aligned.content");
    var $progressBar=$("div[id='" + object.movie.Title + "'] .ui.tiny.progress");
    var $updatedProgressBar= '<div class="ui tiny progress"  data-percent = ' + avg + '>' +'<div class="bar" style = "transition-duration : 300ms;  width : ' + avg + '%">';

    $progressBar.remove();
    $($field).append($updatedProgressBar);

}
var appendmodal = function(movie) {
    var $popUpElement = $('<div class = "ui modal"><i class="close icon" id ="modal-button"></i>' +
        '<div class="ui items">' +
        '<div class="item">' +
        '<div class="image">' +
        '<img src=' + movie.Poster + '>' +
        '</div>' +
        '<div class="content">' +
        '<h1 class="ui header">' + movie.Title + ' (' + movie.Year + ')' +
        '<div class="sub header">' +
        movie.Rated + ' | ' + movie.Runtime + ' | ' + movie.Genre + ' | ' + movie.Released + ' (' + movie.Country + ')' +
        '</div>' +
        '</h1>' +
        '<hr>' +
        '<div class="description">' +
        '<p>' + movie.Plot + '</p>' +
        '</div>' +
        '<div class="extra">' +
        '<p><strong>Director</strong>: ' + movie.Director + '</p>' +
        '<p><strong>Writers</strong>: ' + movie.Writer + '</p>' +
        '<p><strong>Stars</strong>: ' + movie.Actors + '</p>' +
        '</div>' +
        '</div>' +
        '<h3 class="ui bottom attached header">' +
        '<p>Metascore: ' + movie.Metascore + '</p>' +
        '<p>IMDB Rating: ' + movie.imdbRating + '</p>' +
        '<p>IMDB Votes: ' + movie.imdbVotes + '</p>' +
        '<p>Awards: ' + movie.Awards + '</p>' +
        '</h3>' +
        '</div>' +
        '</div>' +
        '</div>');
    $('head').append($popUpElement);
    $('.ui.modal').modal('show');
    modal($popUpElement);
}

var modal = function($popUpElement) {

    $('#modal-button').on('click', function() {
        $('.ui.modal').modal('hide');
        $('.ui.modal').remove();
    })
}


$(document).ready(main);
