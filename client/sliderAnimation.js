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

    $("#left-bttn").on("click", function() {
        if (start < 1) {
            start = total - step;
            end = total;

        } else {
            start -= step;
            end -= step;
        }
        generateMore([start, end], arrayOfItems, movies);
    });
    $("#right-bttn").on("click", function() {
        if (end > total - 1) {
            start = 0;
            end = step;
        } else {
            start += step;
            end += step;
        }
        generateMore([start, end], arrayOfItems, movies);
    });


}

var generateMore = function(indexes, arrayOfItems, movies) {
    var numberOfSquaresToShow = indexes[1];
    var i = indexes[0];
    var $container = $("body .ui.grid .ten.wide.column .movie-container .ui.grid");
    var $img = $('body .ten.wide.column .movie-container .ui.grid .five.wide.column .ui.card .image img');
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
            console.log(index);
            appendmodal(movies[index].title);

        })

        $(this).find('.ui .green').on('click', function() {

            var input = { vote: "yes", title: movies[index].title };
            sendVoteToServer(input, index, this.closest('.extra'));
        })

        $(this).find('.ui .red').on('click', function() {
            var input = { vote: "no", title: movies[index].title };
            sendVoteToServer(input, index, this.closest('.extra'));
        })
    });

}

var sendVoteToServer = function(input, index, parentNode) {
    $.post('/movie/title/vote', input, function(res) {
        console.log(res.result);

        if (res.result == 'success') {
            //update votes on the movie
            Movies[index].meta.votes = res.newVotes;
            Movies[index].meta.likes = res.newLikes;

            //Update rating
            $(parentNode).find('.rating').text('Likes: ' + res.newLikes + ' / Total Votes: ' + res.newVotes);
        }
    })
}

var newItem = function(object) {
    //    $photo = Movies[i].photo;
    var item;
    var $id;
    $item = $('<div class="five wide column">' +
        '<div class="ui card">' +
        '<div class="ui center aligned segment">' + object.title + '</div>' // title
        +
        '<div class="image">' +
        '<img src=' + object.photo + ' >' +
        '</div>' +
        '<div class="extra center aligned content">' +
        '<div class="ui two attached buttons">' +
        '<button class="ui green button"><i class="chevron up icon"></i></button>' +
        '<div class="or"> </div>' +
        '<button class="ui red button"><i class="chevron down icon"></i></button>' +
        '</div>' +
        '<span class="rating">Likes: ' + object.meta.likes + ' / Total Votes: ' + object.meta.votes + '</span></div></div></div>');
    return $item;
}

var appendmodal = function(name) {
    $.getJSON('http://www.omdbapi.com/?t=' + name + '&y=&plot=short&r=json', function(info) {
        var $popUpElement = $('<div class = "ui modal"><i class="close icon" id ="modal-button"></i>' +
            ' <h1 class="ui header">' + name +
            '</hi>' +
            '<p>' + info.Year + '</p>' +
            +'</div></div>');
        $('head').append($popUpElement);
        $('.ui.modal').modal('show');
        modal($popUpElement);

    });
}

var modal = function($popUpElement) {

    $('#modal-button').on('click', function() {
        $('.ui.modal').modal('hide');
        $('.ui.modal').remove();
    })
}


$(document).ready(main);