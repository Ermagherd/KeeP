"use strict";

$( document ).ready(function() {

/*
..######..########.####..######..##....##.##....##
.##....##....##.....##..##....##.##...##...##..##.
.##..........##.....##..##.......##..##.....####..
..######.....##.....##..##.......#####.......##...
.......##....##.....##..##.......##..##......##...
.##....##....##.....##..##....##.##...##.....##...
..######.....##....####..######..##....##....##...
*/

  $('.ui.sticky.chat')
    .sticky({
      offset       : 50,
      bottomOffset : 50,
    })
  ;

/*
.##.....##..#######..########.....###....##......
.###...###.##.....##.##.....##...##.##...##......
.####.####.##.....##.##.....##..##...##..##......
.##.###.##.##.....##.##.....##.##.....##.##......
.##.....##.##.....##.##.....##.#########.##......
.##.....##.##.....##.##.....##.##.....##.##......
.##.....##..#######..########..##.....##.########
*/

$('body').on('click', '#profile-pic', function () {
  $('#new-profile-pic.ui.basic.modal')
  .modal('show')
  ;
})

/*
.##.....##..######..########.########......######..########....###....########...######..##.....##
.##.....##.##....##.##.......##.....##....##....##.##.........##.##...##.....##.##....##.##.....##
.##.....##.##.......##.......##.....##....##.......##........##...##..##.....##.##.......##.....##
.##.....##..######..######...########......######..######...##.....##.########..##.......#########
.##.....##.......##.##.......##...##............##.##.......#########.##...##...##.......##.....##
.##.....##.##....##.##.......##....##.....##....##.##.......##.....##.##....##..##....##.##.....##
..#######...######..########.##.....##.....######..########.##.....##.##.....##..######..##.....##
*/
  function fetchUsers () {
    sessionStorage.clear();
    if ( sessionStorage.users == undefined ) {

      function GetString() {
        var keyValue = "";
        $.ajax({
            async: false,
            type: "GET",
            url: "/profile/all-users",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
              let arrayReturn = [];
              response.forEach(element => {
                arrayReturn.push(element.username);
              });
              keyValue = arrayReturn;
              sessionStorage.setItem('users', JSON.stringify(arrayReturn));
            },
            failure: function (response) {
                console.log("wrong response from database call");
            }
        });
        return keyValue;
      }
      var search = GetString();
    }
  }

  $("input.search").focus( function () {
    fetchUsers();
    var users      = JSON.parse(sessionStorage.users);
    var firstUsers = users.slice(0, 15);
    for (var i = 0; i < firstUsers.length; i++) {
      $("#user-search").append(
        '<option value="' + firstUsers[i] + '">' + firstUsers[i] + '</option>'
      );
    }
  });

/*
..######..########....###....########...######..##.....##....##....##.########.##....##.##.....##.########.
.##....##.##.........##.##...##.....##.##....##.##.....##....##...##..##........##..##..##.....##.##.....##
.##.......##........##...##..##.....##.##.......##.....##....##..##...##.........####...##.....##.##.....##
..######..######...##.....##.########..##.......#########....#####....######......##....##.....##.########.
.......##.##.......#########.##...##...##.......##.....##....##..##...##..........##....##.....##.##.......
.##....##.##.......##.....##.##....##..##....##.##.....##....##...##..##..........##....##.....##.##.......
..######..########.##.....##.##.....##..######..##.....##....##....##.########....##.....#######..##.......
*/

  $("input.search").keyup( function (e) {

    if (e.keyCode == 16) {
      return;
    }

    var research      = $(this).val();
    var users         = JSON.parse(sessionStorage.users);
    var pattern       = new RegExp(`^${research}`, "i");
    var returnedMatch = [];

    for (var i = 0; i < users.length; i++) {
      if (pattern.test(users[i])){
          returnedMatch.push(users[i]);
      }
    }

    var sortedMatch = returnedMatch.sort();

    $("#user-search").html('').append(
      '<option value>Search a profile</option>'
    );

    for (var i = 0; i < sortedMatch.length; i++) {
        $("#user-search").append(
          '<option value="' + sortedMatch[i] + '">' + sortedMatch[i] + '</option>'
        );
    }
  });

/*
....###....########..########.....########.########..####.########.##....##.########.
...##.##...##.....##.##.....##....##.......##.....##..##..##.......###...##.##.....##
..##...##..##.....##.##.....##....##.......##.....##..##..##.......####..##.##.....##
.##.....##.##.....##.##.....##....######...########...##..######...##.##.##.##.....##
.#########.##.....##.##.....##....##.......##...##....##..##.......##..####.##.....##
.##.....##.##.....##.##.....##....##.......##....##...##..##.......##...###.##.....##
.##.....##.########..########.....##.......##.....##.####.########.##....##.########.
*/

  $('body').on( 'click', '#add-friend', function (e) {

    var that = e.currentTarget;
    $(that).addClass('loading');
    let userToFollow = $(that).parent().parent().parent().find(".header").text();

    $.ajax({
      type: "POST",
      url: "/profile/add-friend",
      xhrFields: {
        withCredentials: true
      },
      data : {
        userToFollow: userToFollow
      },
      success: function (response) {
        $(that).removeClass('loading');
        $(that).parent().html(
          '<div class="ui fluid disabled secondary button" id="following"><i class="paper plane icon icon"></i>Demander en attente</div>'
        );
      },
      failure: function (response) {
          console.log("Unable to send friend request user.");
          $(that).removeClass('loading');
      }
    });
  });

/*
.##.....##.##....##.########..#######..##.......##........#######..##......##....########.########..####.########.##....##.########.
.##.....##.###...##.##.......##.....##.##.......##.......##.....##.##..##..##....##.......##.....##..##..##.......###...##.##.....##
.##.....##.####..##.##.......##.....##.##.......##.......##.....##.##..##..##....##.......##.....##..##..##.......####..##.##.....##
.##.....##.##.##.##.######...##.....##.##.......##.......##.....##.##..##..##....######...########...##..######...##.##.##.##.....##
.##.....##.##..####.##.......##.....##.##.......##.......##.....##.##..##..##....##.......##...##....##..##.......##..####.##.....##
.##.....##.##...###.##.......##.....##.##.......##.......##.....##.##..##..##....##.......##....##...##..##.......##...###.##.....##
..#######..##....##.##........#######..########.########..#######...###..###.....##.......##.....##.####.########.##....##.########.
*/

  $('body').on( 'click', '#remove-friend-accepted', function (e) {

    var that = e.currentTarget;
    $(that).addClass('loading');
    let userToRemove = $(that).parent().parent().parent().find(".header").text();

    $.ajax({
      type: "POST",
      xhrFields: {
        withCredentials: true
      },
      url: "/profile/remove-friend",
      data : {
        userToRemove: userToRemove
      },
      success: function (response) {
        $(that).removeClass('loading');
        $(that).parent().html(
          '<div class="ui fluid primary button" id="add-friend"><i class="user plus icon"></i>Demander en ami</div>'
        );
      },
      failure: function (response) {
          console.log("Unable to unfollow user.");
          $(that).removeClass('loading');
      }
    });
  });

/*
....###....########..########..########...#######..##.....##.########....########.########..####.########.##....##.########.
...##.##...##.....##.##.....##.##.....##.##.....##.##.....##.##..........##.......##.....##..##..##.......###...##.##.....##
..##...##..##.....##.##.....##.##.....##.##.....##.##.....##.##..........##.......##.....##..##..##.......####..##.##.....##
.##.....##.########..########..########..##.....##.##.....##.######......######...########...##..######...##.##.##.##.....##
.#########.##........##........##...##...##.....##..##...##..##..........##.......##...##....##..##.......##..####.##.....##
.##.....##.##........##........##....##..##.....##...##.##...##..........##.......##....##...##..##.......##...###.##.....##
.##.....##.##........##........##.....##..#######.....###....########....##.......##.....##.####.########.##....##.########.
*/

$('body').on( 'click', '.approve-friend', function (e) {

  var that = e.currentTarget;
  $(that).addClass('loading');

  let userToApprove = $(that).parent().parent().parent().find(".header").text();

  $.ajax({
    type: "POST",
    xhrFields: {
      withCredentials: true
    },
    url: "/profile/approve-friend",
    data : {
      userToApprove: userToApprove
    },
    success: function (response) {
      $(that).removeClass('loading');
      $(that).parent().parent().parent().remove();
      $('#friends-cards').find(".ui.cards").append(
        '<div class="card"><div class="content"><div class="header"><a href="/profile/' + userToApprove + '">' + userToApprove + '</a></div></div><div class="extra content"><div class="ui buttons"><div class="ui negative button remove-friend">Remove</div></div></div>'
      );

      var friendsPendingCount = $('#feed-amis').find('.ui.teal.left.pointing.label').text();
      $('#feed-amis').find('.ui.teal.left.pointing.label').text(friendsPendingCount - 1);

      var friendsCount = parseInt($('.display-friends').find('span').text());
      $('.display-friends').find('span').text(friendsCount + 1);
    },
    failure: function (response) {
        console.log("Unable to approve user.");
        $(that).removeClass('loading');
    }
  });
});

/*
.########..########.##.....##..#######..##.....##.########....########.########..####.########.##....##.########.
.##.....##.##.......###...###.##.....##.##.....##.##..........##.......##.....##..##..##.......###...##.##.....##
.##.....##.##.......####.####.##.....##.##.....##.##..........##.......##.....##..##..##.......####..##.##.....##
.########..######...##.###.##.##.....##.##.....##.######......######...########...##..######...##.##.##.##.....##
.##...##...##.......##.....##.##.....##..##...##..##..........##.......##...##....##..##.......##..####.##.....##
.##....##..##.......##.....##.##.....##...##.##...##..........##.......##....##...##..##.......##...###.##.....##
.##.....##.########.##.....##..#######.....###....########....##.......##.....##.####.########.##....##.########.
*/

$('body').on( 'click', '.remove-friend', function (e) {

  var that = e.currentTarget;
  $(that).addClass('loading');

  let userToRemove = $(that).parent().parent().parent().find(".header").text();

  $.ajax({
    type: "POST",
    xhrFields: {
      withCredentials: true
    },
    url: "/profile/remove-friend",
    data : {
      userToRemove: userToRemove
    },
    success: function (response) {
      $(that).removeClass('loading');
      $(that).parent().parent().parent().remove();
    },
    failure: function (response) {
        console.log("Unable to remove user.");
        $(that).removeClass('loading');
    }
  });
});

/*
.########..########..######..##.......####.##....##.########....########.########..####.########.##....##.########.
.##.....##.##.......##....##.##........##..###...##.##..........##.......##.....##..##..##.......###...##.##.....##
.##.....##.##.......##.......##........##..####..##.##..........##.......##.....##..##..##.......####..##.##.....##
.##.....##.######...##.......##........##..##.##.##.######......######...########...##..######...##.##.##.##.....##
.##.....##.##.......##.......##........##..##..####.##..........##.......##...##....##..##.......##..####.##.....##
.##.....##.##.......##....##.##........##..##...###.##..........##.......##....##...##..##.......##...###.##.....##
.########..########..######..########.####.##....##.########....##.......##.....##.####.########.##....##.########.
*/

$('body').on( 'click', '.decline-friend', function (e) {

  var that = e.currentTarget;
  $(that).addClass('loading');

  let userToDecline = $(that).parent().parent().parent().find(".header").text();

  $.ajax({
    type: "POST",
    xhrFields: {
      withCredentials: true
    },
    url: "/profile/decline-friend",
    data : {
      userToDecline: userToDecline
    },
    success: function (response) {
      $(that).removeClass('loading');
      $(that).parent().parent().parent().remove();

      var friendsPendingCount = $('#feed-amis').find('.ui.teal.left.pointing.label').text();
      $('#feed-amis').find('.ui.teal.left.pointing.label').text(friendsPendingCount - 1);
    },
    failure: function (response) {
        console.log("Unable to block user.");
        $(that).removeClass('loading');
    }
  });
});

/*
.##.....##.##....##.########..##........#######...######..##....##....########.########..####.########.##....##.########.
.##.....##.###...##.##.....##.##.......##.....##.##....##.##...##.....##.......##.....##..##..##.......###...##.##.....##
.##.....##.####..##.##.....##.##.......##.....##.##.......##..##......##.......##.....##..##..##.......####..##.##.....##
.##.....##.##.##.##.########..##.......##.....##.##.......#####.......######...########...##..######...##.##.##.##.....##
.##.....##.##..####.##.....##.##.......##.....##.##.......##..##......##.......##...##....##..##.......##..####.##.....##
.##.....##.##...###.##.....##.##.......##.....##.##....##.##...##.....##.......##....##...##..##.......##...###.##.....##
..#######..##....##.########..########..#######...######..##....##....##.......##.....##.####.########.##....##.########.
*/

$('body').on( 'click', '.unblock-friend', function (e) {

  var that = e.currentTarget;
  $(that).addClass('loading');

  let userToUnblock = $(that).parent().parent().parent().find(".header").text();

  $.ajax({
    type: "POST",
    xhrFields: {
      withCredentials: true
    },
    url: "/profile/unblock-friend",
    data : {
      userToUnblock: userToUnblock
    },
    success: function (response) {
      // console.log(response);
      $(that).removeClass('loading');
      $(that).parent().parent().parent().remove();
      $('#friends-cards').find(".ui.cards").append(
        '<div class="card"><div class="content"><div class="header"><a href="/profile/' + userToUnblock + '">' + userToUnblock + '</a></div></div><div class="extra content"><div class="ui buttons"><div class="ui negative button remove-friend">Remove</div></div></div>'
      );

      var friendsCount = parseInt($('.display-friends').find('span').text());
      $('.display-friends').find('span').text(friendsCount + 1);
    },
    failure: function (response) {
        console.log("Unable to unblock user.");
        $(that).removeClass('loading');
    }
  });
});

/*
.########...#######...######..########
.##.....##.##.....##.##....##....##...
.##.....##.##.....##.##..........##...
.########..##.....##..######.....##...
.##........##.....##.......##....##...
.##........##.....##.##....##....##...
.##.........#######...######.....##...
*/

$("body").on( 'click', '#user-post', function (e) {

  var that = e.currentTarget;
  let text = $(that).text();
  let placeHolder = 'Quoi de neuf ?';
  if (text === placeHolder) {
    let text = $(that).text('');
  }

})

$('body').on( 'click', '#post-submit', function (e) {

  var that = e.currentTarget;
  let placeHolder = 'Quoi de neuf ?';
  $(that).addClass('loading');
  let message = $('#user-post').val();
  var pattern = /(<([^>]+)>)/ig;
  let content = message.replace(pattern, "");

  if (content.length <= 0) {

    $('#empty-post.ui.basic.modal')
    .modal('show')
    ;
    $(that).removeClass('loading');

  } else {

    $.ajax({
      type: "POST",
      xhrFields: {
        withCredentials: true
      },
      url: "/profile/post-comment",
      data : {
        content: content
      },
      success: function (response) {

        $(that).removeClass('loading');

        if (response === 'empty') {
          // alert('votre message est vide');
        } else {

          var post = response[0];
          var profilePicSrc = $('#profile-pic').attr('src');
          // console.log(profilePicSrc);
          var newPost = '<div class="ui segment" id="' + post._id + '"><div class="ui items"><div class="item"><div class="image" id="post-profile-pic"><img src="' + profilePicSrc + '"></div><div class="content"><a class="header" href="/profile/' + post.username + '">' + post.username + '</a><div class="meta"><span>' + post.creationDate + '</span></div><div class="description"><p>' + post.content + '</p></div><div class="extra"><button class="ui compact icon negative button right floated delete-post"><i class="trash icon"></i></button></div></div></div></div></div>';
          // $("#post-wrapper").prepend(newPost);
          $(newPost).prependTo("#post-wrapper").hide().show('slow');
          $('#user-post').val(placeHolder);

        }
      },
      failure: function (response) {
          console.log("Unable to post comment.");
          $(that).removeClass('loading');
      }
    });
  }
});
/*
.########...#######...######..########....########..########.##.......########.########.########
.##.....##.##.....##.##....##....##.......##.....##.##.......##.......##..........##....##......
.##.....##.##.....##.##..........##.......##.....##.##.......##.......##..........##....##......
.########..##.....##..######.....##.......##.....##.######...##.......######......##....######..
.##........##.....##.......##....##.......##.....##.##.......##.......##..........##....##......
.##........##.....##.##....##....##.......##.....##.##.......##.......##..........##....##......
.##.........#######...######.....##.......########..########.########.########....##....########
*/

$('body').on( 'click', '.delete-post', function (e) {

  var that = e.currentTarget;
  $('#delete-post.ui.basic.modal')
  .modal('show')
  ;

  $('#delete-post-modal').click( function (e) {

    $(that).addClass('loading');
    let postId = $(that).parents('.ui.segment').attr('id');

    $.ajax({
      type: "POST",
      xhrFields: {
        withCredentials: true
      },
      url: "/profile/delete-post",
      data : {
        postId: postId
      },
      success: function (response) {
        $(that).removeClass('loading');
        if (response === 'post delete') {
          $(that).parents('.ui.segment').hide('slow', function(){ $(that).parents('.ui.segment').remove(); });
        }
      },
      failure: function (response) {
          console.log("Unable to post comment.");
          $(that).removeClass('loading');
        }
    });
  });
});

/*
..######....#######.....########..#######.....########..########...#######..########.####.##.......########
.##....##..##.....##.......##....##.....##....##.....##.##.....##.##.....##.##........##..##.......##......
.##........##.....##.......##....##.....##....##.....##.##.....##.##.....##.##........##..##.......##......
.##...####.##.....##.......##....##.....##....########..########..##.....##.######....##..##.......######..
.##....##..##.....##.......##....##.....##....##........##...##...##.....##.##........##..##.......##......
.##....##..##.....##.......##....##.....##....##........##....##..##.....##.##........##..##.......##......
..######....#######........##.....#######.....##........##.....##..#######..##.......####.########.########
*/

  $('.dropdown').dropdown({
    onChange: function (value) {
      location.href='/profile/' + value;
    }
  });

/*
.########..####..######..########..##..........###....##....##....########.########..####.########.##....##.########...######.
.##.....##..##..##....##.##.....##.##.........##.##....##..##.....##.......##.....##..##..##.......###...##.##.....##.##....##
.##.....##..##..##.......##.....##.##........##...##....####......##.......##.....##..##..##.......####..##.##.....##.##......
.##.....##..##...######..########..##.......##.....##....##.......######...########...##..######...##.##.##.##.....##..######.
.##.....##..##........##.##........##.......#########....##.......##.......##...##....##..##.......##..####.##.....##.......##
.##.....##..##..##....##.##........##.......##.....##....##.......##.......##....##...##..##.......##...###.##.....##.##....##
.########..####..######..##........########.##.....##....##.......##.......##.....##.####.########.##....##.########...######.
*/

  $('body').on ( 'click', 'a.display-friends',function (e) {

    $('#wallwrapper').toggleClass("hiddenthing");
    $('#friendswrapper').toggleClass("hiddenthing");

  });

  $('body').on ( 'click', '#feed-amis',function (e) {

    $('#wallwrapper').toggleClass("hiddenthing");
    $('#friendswrapper').toggleClass("hiddenthing");

  });

/*
.########..########..######..########.########....########.....###.....######...######..##......##..#######..########..########.
.##.....##.##.......##....##.##..........##.......##.....##...##.##...##....##.##....##.##..##..##.##.....##.##.....##.##.....##
.##.....##.##.......##.......##..........##.......##.....##..##...##..##.......##.......##..##..##.##.....##.##.....##.##.....##
.########..######....######..######......##.......########..##.....##..######...######..##..##..##.##.....##.########..##.....##
.##...##...##.............##.##..........##.......##........#########.......##.......##.##..##..##.##.....##.##...##...##.....##
.##....##..##.......##....##.##..........##.......##........##.....##.##....##.##....##.##..##..##.##.....##.##....##..##.....##
.##.....##.########..######..########....##.......##........##.....##..######...######...###..###...#######..##.....##.########.
*/

$('body').on( 'click', '#reset-password-button', function (e) {

  e.preventDefault();

  var that = e.currentTarget;
  $(that).addClass('loading');
  let pseudo = $(that).parent().find("input[name='username']").val();
  let password = $(that).parent().find("input[name='password']").val();

  $.ajax({
    type: "POST",
    url: "/account/reset-password",
    xhrFields: {
      withCredentials: true
    },
    data : {
      pseudo: pseudo,
      password: password
    },
    success: function (response) {
      $(that).removeClass('loading');
    },
    failure: function (response) {
        console.log("Unable to reset password.");
        $(that).removeClass('loading');
    }
  });
});


/*
.......########.....###.....######...####.##....##....###....########.####..#######..##....##
.......##.....##...##.##...##....##...##..###...##...##.##......##.....##..##.....##.###...##
.......##.....##..##...##..##.........##..####..##..##...##.....##.....##..##.....##.####..##
.......########..##.....##.##...####..##..##.##.##.##.....##....##.....##..##.....##.##.##.##
.......##........#########.##....##...##..##..####.#########....##.....##..##.....##.##..####
.......##........##.....##.##....##...##..##...###.##.....##....##.....##..##.....##.##...###
.......##........##.....##..######...####.##....##.##.....##....##....####..#######..##....##
*/


  var count = 1;
  window.loadMorePost = function() {
    // load fake content
    var
      $segment = $('#post-wrapper'),
      $loader  = $segment.find('.inline.loader'),
      $content = $('<h3 class="ui header">Loaded Content #' + count + '</h3><img class="ui wireframe image" src="/images/wireframe/paragraph.png"><img class="ui wireframe image" src="/images/wireframe/paragraph.png"><img class="ui wireframe image" src="/images/wireframe/paragraph.png">')
    ;
    if(count <= 5) {
      $loader.addClass('active');
      setTimeout(function() {
        $loader
          .removeClass('active')
          .before($content)
        ;
        $('.ui.sticky')
          .sticky('refresh')
        ;
        $('.visibility.example > .overlay, .visibility.example > .demo.segment, .visibility.example .items img')
          .visibility('refresh')
        ;
      }, 1000);
    }
    count++;
  }

  $('#post-wrapper')
  .visibility({
    once: false,
    // update size when new content loads
    observeChanges: true,
    // load content on bottom edge visible
    onBottomVisible: function() {

      // loads a max of 5 times
      // window.loadFakeContent();
      // window.loadMorePost();
    }
  });


});