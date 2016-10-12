

var Movies = [];

var main = function ()
{
    retrieveMovies();
}


var retrieveMovies = function()
{
	$.get('/movie', function(result){
		Movies = result;
		displayMovies(Movies);
	});
}

var displayMovies = function(movies)
{
    var step=0, start=0, end=3, total=movies.length;
    var indexes=[start,end,step];
    var arrayOfItems=[];
    var i=0;
    //generate all movies and put in arrayOfItems
    for(i;i<total;i++)
    {
        var $element= newItem(movies[i]);
        console.log(movies[0]);
        arrayOfItems.push($element);
    }

    //put all elements in array
    generateMore(indexes, arrayOfItems);

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
        generateMore([start,end],arrayOfItems);
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
        generateMore([start,end],arrayOfItems);
    });
}

var generateMore = function(indexes,arrayOfItems)
{
    var numberOfSquaresToShow=indexes[1];
    var i=indexes[0];
    var $container = $("body .ui.grid .ten.wide.column .movie-container .ui.grid");
    var $img=$('body .ten.wide.column .movie-container .ui.grid .five.wide.column .ui.card .image img');
    $($container).empty();
    for ( i; i < numberOfSquaresToShow; ++i)
    {
        $container.append(arrayOfItems[i]);
    }

    //Pop Up style
    $(arrayOfItems).each(function(index)
    {
        $(this).on('click',function()
        {
            appendmodal();
            $('.ui.modal').modal('show');
        })
    });
}

var newItem = function(object)
{
//    $photo = Movies[i].photo;
    var item;
    var $id;
    $item= $('<div class="five wide column">'
                    +'<div class="ui card">'
                    +'<div class="ui center aligned segment">'+object.title+'</div>' // title
                    +'<div class="image">'
                    +'<img src='+object.photo+' >'
                    +'</div>'
                    +'<div class="extra center aligned content">'
                    +'<div class="ui two attached buttons">'
                    +'<button class="ui green button"><i class="chevron up icon"></i></button>'
                    +'<div class="or"> </div>'
                    +'<button class="ui red button"><i class="chevron down icon"></i></button>'
                    +'</div>'+object.meta.likes/100+'</div></div></div>');
    return $item;
}

var appendmodal = function ()
{
    var $popUpElement =$('<div class = "ui modal"><i class="close icon" id ="modal-button"></i>'
    +' <h1 class="ui header">'+'make call to omdb and parse info in a pretty way'
    +'</hi>'
    +'</div></div>');
    $('head').append($popUpElement);
    $('#modal-button').on('click',function()
    {
        $('.ui.modal').modal('hide');
        $('.ui.modal').remove();
    })
}

$(document).ready(main);
