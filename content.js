console.log('loaded SJW script');
var api_base = 'https://8137cc5e.ngrok.io';
var sjw_text = 'https://pbs.twimg.com/media/Clh5FKpVYAAGStA.jpg'
var sjw_logo = 'https://pbs.twimg.com/media/Clh6oCQUsAA8wIf.png'
var checked_for_sjws = false;

function getTweets() {
  return $('li.js-stream-item.stream-item.stream-item');
}

function getTimestamps() {
  return $('.tweet-timestamp.js-permalink.js-nav.js-tooltip');
}

function checkForSJW(tweets) {
  tweets.each(function() {
    var tweet = $(this);
    var handle = tweet.find('div.tweet').data('screen-name');

    $.ajax({
      url: api_base + '/warriors/check/' + handle,
      dataType: 'json',
      success: function(data) {
        if (data['sjw'] == 'true') {
          tweet.find('div.content').find('img.avatar').attr('src', sjw_text);
        }
      }
    })
  })
}

function addIconToTimestamps(timestamps) {
  timestamps.each(function() {$(this).after('<img class="sjw-logo" style="width: 20px; height: 20px; margin-left:5px; float:right;" src='+sjw_logo+'>') });
}

// only run checks if user viewing generic twitter feed (or notifications tab, TBD)
setInterval(function() {
  if ($('div.ProfileCanopy').length == 0 && checked_for_sjws == false) {
    var tweets = getTweets();
    checkForSJW(tweets)
    var timestamps = getTimestamps();
    addIconToTimestamps(timestamps);
    checked_for_sjws = true;
  }
}, 500)

// out of service due to Z-Index of twitter native elements, near the timestamp badge
// $('.sjw-logo').on('click', function(e){
//   e.preventDefault();
//   var username = $(this).parents('div.tweet').data('screen-name');
//   console.log(username);
// })

if ($('div.ProfileCanopy').length == 1) {

  var nominee = $('div.ProfileHeaderCard').find('span.u-linkComplex-target').text();
  var nominator = $('li.current-user').find('a').attr('href').split('/')[1];

  var refreshInterval = setInterval(function() {
      if ($('div#nominate-sjw').length == 0) {
        checkForNomination();
      }
    }, 500)

  function checkForNomination() {
    $.ajax({
      url: api_base + '/nominees/check/' + nominee + '/' + nominator,
      dataType: 'json',
      success: function(data) {
        if (data['nominated'] == 'true') {
          showThanks();
          clearInterval(refreshInterval);
        }
        else {showNomination(); clearInterval(refreshInterval);}
      }
    })
  }

  function showThanks() {
    $('div.ProfileMessagingActions-actionsContainer').append('<div id="nominate-sjw"><button class="u-sizeFull js-tooltip btn primary-btn tweet-action tweet-btn" type="button" style="background-color:#fab81e"><span class="NewTweetButton-content button-text tweeting-text u-textTruncate"><span class="NewTweetButton-text" id="sjw-cta" aria-hidden="true">Thanks for the nomination.</span></span></button></div>');
    $("#nominate-sjw").attr("disabled", "disabled");
  }

  function showNomination(){
    $('div.ProfileMessagingActions-actionsContainer').append('<div id="nominate-sjw"><button class="u-sizeFull js-tooltip btn primary-btn tweet-action tweet-btn" type="button" style="background-color:#ff1d8e"><span class="NewTweetButton-content button-text tweeting-text u-textTruncate"><span class="NewTweetButton-text" id="sjw-cta" aria-hidden="true">Nominate to SJW</span></span></button></div>');
  };

  $('body').on('click', '#nominate-sjw', function(e) {
    e.preventDefault();
    if ($(this).attr('disabled') == 'disabled') {return false;} // handle already nominated

    if ($('div#nominate-sjw').length == 1) {clearInterval(refreshInterval);}

    $.ajax({
      url: api_base + '/nominate',
      method: 'post',
      data: {nominator_handle: nominator, nominee_handle: nominee},
      success: function(data) {
        alert('@' + nominee + 'was nominated successfully!');
        $('span#sjw-cta').text('Thanks!');
        $('div#nominate-sjw').fadeOut(1250);
      }
    })

  })

}
