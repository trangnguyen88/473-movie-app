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
        //Remove click eventhandler if it is set before to prevent duplication
        $(this).unbind('click');

        //Add click eventhandler back
        $(this).on('click', function() {
            console.log(index);
            appendmodal(movies[index].title);

        })
    });

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
        '</div>' + object.meta.likes / 100 + '</div></div></div>');
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