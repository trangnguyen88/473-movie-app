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
        $('.movie-container')
        .transition(
            {
                animation  : 'fade right',
                duration   : '.7s',
                onComplete : function()
                {
                    generateMore([start,end],arrayOfItems);
                    $('.movie-container')
                    .transition(
                        {
                            animation  : 'fade left',
                            duration   : '.7s',
                        });
                }
            });
    });

    $("#right-bttn").on("click", function() {
        if (end > total - 1) {
            start = 0;
            end = step;
        } else {
            start += step;
            end += step;
        }
        $('.movie-container')
        .transition(
            {
                animation  : 'fade left',
                duration   : '.7s',
                onComplete : function()
                {
                    generateMore([start,end],arrayOfItems);
                    $('.movie-container')
                    .transition(
                        {
                            animation  : 'fade right',
                            duration   : '.7s',
                        });
                }
            });
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
            appendmodal(movies[index].movie);

        })

        $(this).find('.ui .green').on('click', function() {

            var input = { vote: "yes", title: movies[index].movie.Title };
            sendVoteToServer(input, index, this.closest('.extra'), $(this).parent());
        })

        $(this).find('.ui .red').on('click', function() {
            var input = { vote: "no", title: movies[index].movie.Title };
            sendVoteToServer(input, index, this.closest('.extra'), $(this).parent());
        })
    });

}

var sendVoteToServer = function(input, index, parentNode, node) {
    $.post('/movie/title/vote', input, function(res) {
        //console.log(res.result);
        //console.log(parentNode);
        var $temp = node.next();
        //console.log($temp);

        if (res.result == 'success') {
            //update votes on the movie
            Movies[index].meta.votes = res.newVotes;
            Movies[index].meta.likes = res.newLikes;
            var progressBar = (res.newLikes/res.newVotes)*100;
            //console.log("Progress equals to : " +progressBar);

            //Update rating
            $(parentNode).find('.rating').text('Likes: ' + res.newLikes + ' / Total Votes: ' + res.newVotes);

            //Update the width of progress bar
            var $temp1 = $temp.children();
            //console.log($temp1.width());
    
            $temp1.width(progressBar +'%');

            var $temp2 = $temp1.children();
            $temp2.text(parseInt(progressBar) +'%');

            //console.log("DONE");
            
        }
    })
}

var newItem = function(object) {
    //    $photo = Movies[i].photo;
    var item;
    var $id;
    var $progress;// = parseInt(object.meta.likes/object.meta.votes*100);
        if( object.meta.likes==0 && object.meta.votes==0)
            $progress = 0;
        else
            $progress = parseInt(object.meta.likes/object.meta.votes*100);
    console.log($progress);
        $item = $('<div class="five wide column">' +
        '<div class="ui card">' +
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
        '<div class="ui progress"  data-percent = '+ $progress + '>' +
        '<div class="bar" style = "transition-duration : 300ms; width : ' + $progress + '%">' +
        '<div class="progress">'+ $progress + '%</div>' +
        '</div>' +
        '</div>' +
        '</div></div></div>');
    return $item;
}

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
           '<p>' + movie.Plot +'</p>' +
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
   $('head').append($popUpElement.clone());
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
