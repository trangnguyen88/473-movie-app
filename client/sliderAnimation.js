

var Movies = [];

var main = function ()
{
    retrieveMovies();
}


var retrieveMovies = function()
{
	$.get('/movie', function(result){
		Movies = result;
		displayMovies(result);
	});
}

var displayMovies = function(movies)
{
	var start=0, end=3, total=movies.length-1;
    var indexes=[start,end];
	
    //put all elements in array
    generateMore(indexes);

    $("#left-bttn").on("click",function () {
        if(start<1)
        {
            start=total-3;
            end=total;

        }
        else {
            start-=3;
            end-=3;
        }
        generateMore([start,end])
    });
    $("#right-bttn").on("click",function () {
        if(end>total-1)
        {
            start=0;
            end=3;
        }
        else
        {
        start+=3;
        end+=3;
        }
        generateMore([start,end])
    });
}

var generateMore = function(indexes)
{
    var numberOfSquaresToShow=indexes[1];
    var i=indexes[0];
    var $container = $("body .ui.grid .ten.wide.column .movie-container .ui.grid");
    var $img=$('body .ten.wide.column .movie-container .ui.grid .five.wide.column .ui.card .image img');
    $($img).fadeOut();
    $($container).empty();
    for ( i; i < numberOfSquaresToShow; ++i)
    {
		$photo = Movies[i].photo;	
        var $newMovie= $('<div class="five wide column">'
                        +'<div class="ui card">'
                        +'<div class="ui center aligned segment">'+i+'</div>'
                        +'<div class="image">'
                        +'<img src='+$photo+'>'
                        +'</div>'
                        +'<div class="extra center aligned content">'
                        +'<div class="ui two attached buttons">'
                        +'<button class="ui green button"><i class="chevron up icon"></i></button>'
                        +'<div class="or"> </div>'
                        +'<button class="ui red button"><i class="chevron down icon"></i></button>'
                        +'</div></div></div></div>');

    $container.append($newMovie);
    }
    $container.fadeIn();
}

$(document).ready(main);
