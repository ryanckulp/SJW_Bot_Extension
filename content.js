console.log('SJW script LOADED');
var api_base = 'https://sjwbot.herokuapp.com',
    sjw_text = 'https://pbs.twimg.com/media/Clh5FKpVYAAGStA.jpg',
    sjw_logo = 'https://pbs.twimg.com/media/Clh6oCQUsAA8wIf.png',
    checked_for_sjws = false;

function getTweets() {
  return $('li.js-stream-item.stream-item.stream-item');
}

function checkForSJW(tweets) {
  tweets.each(function() {
    var tweet = $(this),
        handle = tweet.find('div.tweet').data('screen-name');

    $.ajax({
      url: api_base + '/warriors/check/' + handle,
      dataType: 'json',
      success: function(data) {
        if (data['sjw'] == 'true') {
          tweet.find('div.content').find('img.avatar').attr('src', sjw_text);
          tweet.find('.tweet-timestamp').after('<img class="sjw-logo" style="width: 20px; height: 20px; margin-left:5px; float:right;" src='+sjw_logo+'>')
        }
      }
    })
  })
}

// only run checks if user viewing generic twitter feed (or notifications tab, TBD)
setInterval(function() {
  if ($('div.ProfileCanopy').length == 0 && checked_for_sjws == false) {
    var tweets = getTweets();
    checkForSJW(tweets)
    checked_for_sjws = true;
  }
}, 500)

// check for sjws again, if user auto loads more tweetes in feed
$(window).scroll(function() {
   if($(window).scrollTop() + $(window).height() == $(document).height()) {
     var tweets = getTweets();
     console.log('got new tweets');
     checkForSJW(tweets);
   }
});

if ($('div.ProfileCanopy').length == 1) {
  var nominee = $('div.ProfileHeaderCard').find('span.u-linkComplex-target').text(),
      nominator = $('li.current-user').find('a').attr('href').split('/')[1];
      avatar = $('div.ProfileAvatar').find('img');

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

        if (data['warrior'] == 'true') {
          avatar.attr('src', 'https://pbs.twimg.com/media/Clh6oCQUsAA8wIf.png')
          showThanks();
          clearInterval(refreshInterval);
        }

        if ($('button.UserActions-editButton.edit-button').find('.button-text').text() == 'Edit profile') {
          showPromo();
          clearInterval(refreshInterval);
        }

        else {showNomination(); clearInterval(refreshInterval);}
      }
    })
  }

  function showPromo() {
    $('div.ProfileMessagingActions-actionsContainer').append('<div id="nominate-sjw"><button class="u-sizeFull js-tooltip btn primary-btn tweet-action tweet-btn" type="button" style="background-color:#19cf86"><span class="NewTweetButton-content button-text tweeting-text u-textTruncate"><span class="NewTweetButton-text" id="sjw-cta" aria-hidden="true">Thanks for using SJW Bot!</span></span></button></div>');
    $("#nominate-sjw").attr("disabled", "disabled");
    $("#nominate-sjw").addClass("promo");
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
    if ($(this).hasClass('promo')) {window.open('http://www.sjwbot.com', '_blank'); return false;} // handle user on own profile page
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
