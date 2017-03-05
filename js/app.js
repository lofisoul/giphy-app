//setting up Firebase
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDtw-SvcPLB41RzvESP4A-lmOJQj5qnG0w",
  authDomain: "simpsons-gif-generator.firebaseapp.com",
  databaseURL: "https://simpsons-gif-generator.firebaseio.com",
  storageBucket: "simpsons-gif-generator.appspot.com",
  messagingSenderId: "988968041445"
};

firebase.initializeApp(config);
var database = firebase.database();


//giphy logic
var searchTerms = ['Homer','Marge','Bart','Lisa','Maggie','Grandpa'];
var keyTerm = 'The+Simpsons';
var gifsOnPage = false;


function initGif() {
  //check the firebase for searchTerms
  database.ref().on('value', function(snapshot) {
    if(snapshot.child('searchTerms').exists()) {
          console.log('dont exist yet!');
          searchTerms = snapshot.val().searchTerms;
      }
    }, function(errorObject) {
      // In case of error this will print the error
      console.log("The read failed: " + errorObject.code);
    });

  //generate initial pills
  for (i=0; i<searchTerms.length; i++) {
    var term = searchTerms[i];
    var bgColor = colorGen();
    $('.tags-wrap').append('<li class="tag-item col-xs-6"><button class="tag" style="background-color:'+bgColor+'" data-char="'+ term +'">'+term+'</button></li>');
  }

  if(gifsOnPage === false) {
      callChar('Homer');
      gifsOnPage = true;
  }
}

function callChar(term) {
  $('.fish-bowl').empty();
  var queryURL = 'https://api.giphy.com/v1/gifs/search?q=' + term + '+' + keyTerm + '&api_key=dc6zaTOxFJmzC&limit=10';
  console.log(queryURL);
  $.ajax({
      url: queryURL,
      method: "GET"
    })
    .done(function(response) {
      var results = response.data;
      for (var i = 0; i < results.length; i++) {
        var gifDiv = $("<div class='grid-item col-xs-6 col-md-4'>");
        // console.log(results[i]);
        var charImage = $('<img class="gif">');
        charImage.attr({
          'data-still': results[i].images.fixed_height_still.url,
          'data-animate': results[i].images.fixed_height.url,
          'data-state': 'still',
          'src': results[i].images.fixed_height_still.url
        });
        gifDiv.append(charImage);
        $('.fish-bowl').prepend(gifDiv);
      }
    });
}

function addTag(e) {
  e.preventDefault();
  var searchVal = $('.form input').val().trim();
  var bgColor = colorGen();
  searchTerms.push(searchVal);
  console.log(searchTerms);
  database.ref().set({
    charList: searchTerms
  });
  console.log('firebase update!');
  console.log(searchTerms);
  $('.tags-wrap').append('<li class="tag-item col-xs-6"><button class="tag" style="background-color:'+bgColor+'"data-char="'+ searchVal +'">'+searchVal+'</button></li>');
  callChar(searchVal);
}

function changeDeck() {
  var term = $(this).attr('data-char');
  callChar(term);
}

function animateGif() {
  var state = $(this).attr('data-state');
  if (state === 'still') {
    $(this).attr('src', $(this).attr('data-animate'));
    $(this).attr('data-state','animate');
  }
    else {
      console.log('stop');
      $(this).attr('src', $(this).attr('data-still'));
      $(this).attr('data-state','still');
    }
}

function colorGen() {
  var colorWheel = ['#F6C945','#EB5DA0', '#0D81BE','#9E60A2'];
  var num = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
  console.log(colorWheel[num]);
  return colorWheel[num];
}

$(window).on('load', function(){
  $('body').addClass('loaded');
});

initGif();
$('.fish-bowl').on('click', '.gif', animateGif);
$('.add-term').on('click', addTag);
$('.tags-wrap').on('click', '.tag', changeDeck);

//form effects -> copied from personal codepen

// Test for placeholder support
$.support.placeholder = (function(){
    var i = document.createElement('input');
    return 'placeholder' in i;
})();

// Hide labels by default if placeholders are supported
if($.support.placeholder) {
    $('.form li').each(function(){
        $(this).addClass('js-hide-label');
    });

 $('.form li').find('input, textarea').on('keyup blur focus', function(e){

    // Cache our selectors
    var $this = $(this),
        $parent = $this.parent();

    // Add or remove classes
    if (e.type == 'keyup') {
        if( $this.val() == '' ) {
    $parent.addClass('js-hide-label');
} else {
    $parent.removeClass('js-hide-label');
}
    }
    else if (e.type == 'blur') {
        if( $this.val() == '' ) {
    $parent.addClass('js-hide-label');
}
else {
    $parent.removeClass('js-hide-label').addClass('js-unhighlight-label');
}
    }
    else if (e.type == 'focus') {
       if( $this.val() !== '' ) {
    $parent.removeClass('js-unhighlight-label');
       }
    }
});
}
